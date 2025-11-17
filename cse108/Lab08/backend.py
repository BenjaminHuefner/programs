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
# admin.ModelView().is_accessible = False
# admin pass = admin123test
# teacher pass = teacher123test
# student pass = student123test

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
    
with app.app_context():
    db.create_all()
    # Course.__table__.drop(db.engine, checkfirst=True)



@app.route("/")
def check():
    # firstCourseTaught= Course.query.filter_by(teacher_id=User.query.filter_by(name='Ralph Jenkins').first().id).first()
    # studentIdsInFirstCourse= Enrollment.query.filter_by(course_id=firstCourseTaught.id).all()
    # studentNames = []
    # for student in studentIdsInFirstCourse:
    #     studentNames.append(User.query.filter_by(id=student.student_id).first().name)
    # return studentNames
    return redirect(url_for('login'))
    # data = [
    #     {'name': 'Alice', 'age': 30, 'city': 'New York'},
    #     {'name': 'Bob', 'age': 24, 'city': 'London'},
    #     {'name': 'Charlie', 'age': 35, 'city': 'Paris'},
    #     {'name': 'Diana', 'age': 28, 'city': 'Tokyo'},
    # ]
    # return render_template('index.html', data=data)

@app.route("/login", methods=['GET', 'POST'])
def login():
    if( request.method == 'POST' ):
        username = request.form['username']
        password = request.form['password']
        # return f"Username: {username}, Password: {password}"
        user = User.query.filter_by(name=username).first()
        if (user and user.password == password):
            # resp=make_response(redirect(url_for('courses')))
            # resp.set_cookie('sessionID', '123456789abcdef')
            # return resp
            login_user(user)
            if User.query.filter_by(name=username).first().type == 'admin':
                return redirect('/admin', code='303')
            elif(User.query.filter_by(name=username).first().type == 'teacher'):
                return redirect(url_for('teacher'), code='303')
            else:
                return redirect(url_for('student'), code='303')
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
    # return redirect(url_for('login'))
  
@app.route("/courses")
@login_required
def courses():
    # if request.cookies.get('sessionID') != '123456789abcdef':
    #     return 'error: not logged in'
    return render_template('courses.html')

@app.route("/teacher")
@login_required
def teacher():
    if (current_user.type == 'admin' or current_user.type == 'teacher'):    
        return render_template('professorTest.html')
    else:    
        return redirect('/', code='303')

@app.route("/student")
@login_required
def student():
    if (current_user.type == 'admin' or current_user.type == 'student'):    
        return render_template('courses.html')
    else:    
        return redirect('/', code='303')

@app.route("/logout")
def logout():
    if(current_user.is_authenticated):
        logout_user()
    return redirect(url_for('login'))


if __name__ == "__main__":
    app.run()
