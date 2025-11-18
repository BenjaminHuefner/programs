import json

from flask import Flask, request, render_template, redirect, url_for, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_admin.menu import MenuLink
from flask_admin.base import AdminIndexView
    


app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///enrollment.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "supersecretkey"
app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
app.config['SESSION_PERMANENT'] = False
# print(flask_admin.__version__)


login_manager = LoginManager()
login_manager.init_app(app)


db = SQLAlchemy(app)

class User(UserMixin,db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)  # 'student', 'teacher', 'admin'

    def __str__(self):
        return self.name

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    teacher= db.relationship('User', backref='courses')
    time = db.Column(db.String, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    number_enrolled = db.Column(db.Integer, default=0)

    def __str__(self):
        return self.name

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    student = db.relationship('User', backref='enrollments')
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    course = db.relationship('Course', backref='enrollments')
    grade = db.Column(db.String)

    def __str__(self):
        return f"{self.student.name} enrolled in {self.course.name}"
    
class protectedModelView(ModelView):
    def is_accessible(self):
        # return True
        return (current_user.is_authenticated and current_user.type == 'admin')
            
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login'))
    
class protectedIndexView(AdminIndexView):
    def is_accessible(self):
        # return True
        return (current_user.is_authenticated and current_user.type == 'admin')
            
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login'))

admin = Admin(app, name='microblog', index_view=protectedIndexView())
admin.add_view(protectedModelView(User, db.session))
admin.add_view(protectedModelView(Course, db.session))
admin.add_view(protectedModelView(Enrollment, db.session))
admin.add_link(MenuLink(name='Logout', category='', url='/logout'))


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
    
with app.app_context():
    db.create_all()



@app.route("/")
def check():
    return redirect(url_for('login'))

@app.route("/login", methods=['GET', 'POST'])
def login():
    if( request.method == 'POST' ):
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(name=username).first()
        if (user and user.password == password):
            tempname=username.replace(" ","_")
            login_user(user)
            if User.query.filter_by(name=username).first().type == 'admin':
                return redirect('/admin', code='303')
            elif(User.query.filter_by(name=username).first().type == 'teacher'):
                return redirect(url_for('teacher', teacherName=tempname), code='303')
            else:
                return redirect(url_for('student', studentName=tempname), code='303')
        else:
            
            return redirect(url_for('loginredirect'))
    if request.cookies.get('invalid') == '1':
        resp=make_response(render_template('login.html', invalid=1))
        resp.set_cookie('invalid', '0')
        return resp
    else:
        return render_template('login.html', invalid=0)

@app.route("/login_redirect")
def loginredirect():
    resp=make_response(redirect(url_for('login')))
    resp.set_cookie('invalid', '1')
    return resp

@app.route("/teacher/<teacherName>")
@login_required
def teacher(teacherName):
    realName=teacherName.replace("_"," ")
    if(current_user.type == "admin" or current_user.name==realName):  
        return render_template('professorTest.html', name= teacherName)
    else:    
        return redirect('/', code='303')

@app.route("/teacher/<teacherName>/courses")
@login_required
def getCourses(teacherName):
    realName=teacherName.replace("_"," ")
    if(current_user.type == "admin" or current_user.name==realName):
        if(current_user.type == "admin" and current_user.name==realName):
            allCourses=Course.query.all()
        else:
            teacherID=User.query.filter_by(name=realName).first().id
            allCourses=Course.query.filter_by(teacher_id=teacherID).all()
        arrayOfCourses=[]
        for c in allCourses:
            arrayOfCourses.append({"course":c.name, "teacher":c.teacher.name, "time":c.time,"enrolled":c.number_enrolled,"capacity":c.capacity})
        return json.dumps(arrayOfCourses)
    else:    
        return 0
    
@app.route("/grades/<teacherName>/<course>")
@login_required
def getGrades(teacherName,course):
    realName=teacherName.replace("_"," ")
    realCourseName=course.replace("_"," ")
    if(current_user.type == "admin" or current_user.name==realName):
        tempCourse=Course.query.filter_by(name=realCourseName).first()
        if(current_user.type!="admin"):
            if tempCourse.teacher.name != realName:
                return 0
        allEnrollments=Enrollment.query.filter_by(course_id=tempCourse.id).all()
        arrayOfEnrollments=[]
        for e in allEnrollments:
            arrayOfEnrollments.append({"name":e.student.name, "grade":e.grade})
        return json.dumps(arrayOfEnrollments)
    else:    
        return 0

@app.route("/gradeUpdate/<teacherName>/<course>/<student>", methods=['POST'])
@login_required
def updateGrade(teacherName,course,student):
    if( request.method == 'POST' ):
        realName=teacherName.replace("_"," ")
        realCourseName=course.replace("_"," ")
        realStudentName=student.replace("_"," ")
        tempCourse=Course.query.filter_by(name=realCourseName).first()
        if(current_user.type == "admin" or (current_user.name==realName and tempCourse.teacher.name == realName)):
            studentID=User.query.filter_by(name=realStudentName).first().id
            enrollment=Enrollment.query.filter_by(student_id=studentID, course_id=tempCourse.id).first()
            enrollment.grade=request.data.decode('utf-8')
            print(enrollment.grade)
            db.session.commit()
            return "0"
        else:    
            return "0"
    else:
        return "0"


@app.route("/student/<studentName>")
@login_required
def student(studentName):
    realName=studentName.replace("_"," ")
    if(current_user.type == "admin" or current_user.name==realName):  
        return render_template('student.html', name= studentName)
    else:    
        return redirect('/', code='303')

@app.route("/student/<studentName>/my_courses")
@login_required
def getStudentCourses(studentName):
    realName=studentName.replace("_"," ")
    if(current_user.type == "admin" or current_user.name==realName):
        if(current_user.type == "admin" and current_user.name==realName):
            return 0
        else:
            studentID=User.query.filter_by(name=realName).first().id
            allEnrollments=Enrollment.query.filter_by(student_id=studentID).all()
        arrayOfCourses=[]
        for e in allEnrollments:
            c=Course.query.filter_by(id=e.course_id).first()
            arrayOfCourses.append({"course":c.name, "teacher":c.teacher.name, "time":c.time,"enrolled":c.number_enrolled,"capacity":c.capacity})
        return json.dumps(arrayOfCourses)
    else:    
        return 0
    
@app.route("/student/<studentName>/all_courses")
@login_required
def getAllStudentCourses(studentName):
    realName=studentName.replace("_"," ")
    if(current_user.type == "admin" or current_user.name==realName):
        if(current_user.type == "admin" and current_user.name==realName):
            return 0
        else:
            studentID=User.query.filter_by(name=realName).first().id
            allEnrollments=Enrollment.query.filter_by(student_id=studentID).all()
            allCourses=Course.query.all()
        arrayOfMyCourses=[]
        arrayOfCourses=[]
        for e in allEnrollments:
            arrayOfMyCourses.append(e.course_id)
        for c in allCourses:
            if c.id in arrayOfMyCourses:
                arrayOfCourses.append({"course":c.name, "teacher":c.teacher.name, "time":c.time,"enrolled":c.number_enrolled,"capacity":c.capacity,"isEnrolled":True})
            else:
                arrayOfCourses.append({"course":c.name, "teacher":c.teacher.name, "time":c.time,"enrolled":c.number_enrolled,"capacity":c.capacity,"isEnrolled":False})
        return json.dumps(arrayOfCourses)
    else:    
        return 0

@app.route("/courseUpdate/<studentName>/<course>", methods=['POST','DELETE'])
@login_required
def updateCourse(studentName,course):
    if( request.method == 'POST' ):
        realName=studentName.replace("_"," ")
        realCourseName=course.replace("_"," ")
        tempCourse=Course.query.filter_by(name=realCourseName).first()
        if(current_user.type == "admin" or (current_user.name==realName)):
            if(current_user.type == "admin" and current_user.name==realName):
                return "0"    
            studentID=User.query.filter_by(name=realName).first().id
            enrollment=Enrollment.query.filter_by(student_id=studentID, course_id=tempCourse.id).first()
            if (enrollment is None) and (tempCourse.number_enrolled<tempCourse.capacity):
                db.session.add(Enrollment(student_id=studentID,course_id=tempCourse.id,grade="100"))
                tempCourse.number_enrolled=tempCourse.number_enrolled+1
                db.session.commit()
                studentID=User.query.filter_by(name=realName).first().id
                allEnrollments=Enrollment.query.filter_by(student_id=studentID).all()
                allCourses=Course.query.all()
                arrayOfMyCourses=[]
                arrayOfCourses=[]
                for e in allEnrollments:
                    arrayOfMyCourses.append(e.course_id)
                for c in allCourses:
                    if c.id in arrayOfMyCourses:
                        arrayOfCourses.append({"course":c.name, "teacher":c.teacher.name, "time":c.time,"enrolled":c.number_enrolled,"capacity":c.capacity,"isEnrolled":True})
                    else:
                        arrayOfCourses.append({"course":c.name, "teacher":c.teacher.name, "time":c.time,"enrolled":c.number_enrolled,"capacity":c.capacity,"isEnrolled":False})
                return json.dumps(arrayOfCourses)
            else:
                return "0"
        else:    
            return "0"
    elif(request.method =='DELETE'):
        realName=studentName.replace("_"," ")
        realCourseName=course.replace("_"," ")
        tempCourse=Course.query.filter_by(name=realCourseName).first()
        if(current_user.type == "admin" or (current_user.name==realName)):
            if(current_user.type == "admin" and current_user.name==realName):
                return "0"    
            studentID=User.query.filter_by(name=realName).first().id
            enrollment=Enrollment.query.filter_by(student_id=studentID, course_id=tempCourse.id).first()
            if (enrollment is None) and (tempCourse.number_enrolled<tempCourse.capacity):
                return "0"
            else:
                db.session.delete(enrollment)
                tempCourse.number_enrolled=tempCourse.number_enrolled-1
                db.session.commit()
                studentID=User.query.filter_by(name=realName).first().id
                allEnrollments=Enrollment.query.filter_by(student_id=studentID).all()
                allCourses=Course.query.all()
                arrayOfMyCourses=[]
                arrayOfCourses=[]
                for e in allEnrollments:
                    arrayOfMyCourses.append(e.course_id)
                for c in allCourses:
                    if c.id in arrayOfMyCourses:
                        arrayOfCourses.append({"course":c.name, "teacher":c.teacher.name, "time":c.time,"enrolled":c.number_enrolled,"capacity":c.capacity,"isEnrolled":True})
                    else:
                        arrayOfCourses.append({"course":c.name, "teacher":c.teacher.name, "time":c.time,"enrolled":c.number_enrolled,"capacity":c.capacity,"isEnrolled":False})
                return json.dumps(arrayOfCourses)
        else:    
            return "0"
    else:
        return "0"


@app.route("/logout")
def logout():
    if(current_user.is_authenticated):
        logout_user()
    return redirect(url_for('login'))


if __name__ == "__main__":
    app.run()
