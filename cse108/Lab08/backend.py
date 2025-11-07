from flask import Flask, request, render_template, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user


app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///enrollment.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "supersecretkey"
app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
# print(flask_admin.__version__)
admin = Admin(app, name='microblog')
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

class Teacher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

class Administator(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    
admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Student, db.session))
admin.add_view(ModelView(Teacher, db.session))
admin.add_view(ModelView(Administator, db.session))
admin.add_view(ModelView(Course, db.session))

with app.app_context():
    db.create_all()



@app.route("/")
def check():
    return redirect(url_for('login'))
    # data = [
    #     {'name': 'Alice', 'age': 30, 'city': 'New York'},
    #     {'name': 'Bob', 'age': 24, 'city': 'London'},
    #     {'name': 'Charlie', 'age': 35, 'city': 'Paris'},
    #     {'name': 'Diana', 'age': 28, 'city': 'Tokyo'},
    # ]
    # return render_template('index.html', data=data)
    

@app.route("/login_test", methods=['GET', 'POST'])
def login():
    users=[{'name':'admin','password':'password'},{'name':'user1','password':'pass165'}]
    if( request.method == 'POST' ):
        username = request.form['username']
        password = request.form['password']
        # return f"Username: {username}, Password: {password}"
        if any(user['name'] == username and user['password'] == password for user in users):
            return render_template('courses.html')
    return render_template('login.html')
        
if __name__ == "__main__":
    app.run()
