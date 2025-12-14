import json

from flask import Flask, request, render_template, redirect, url_for, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_admin.menu import MenuLink
from flask_admin.base import AdminIndexView
from werkzeug.security import generate_password_hash, check_password_hash
    


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

    def __str__(self):
        return self.name

    
class protectedModelView(ModelView):
    def is_accessible(self):
        # return True
        return (current_user.is_authenticated and current_user.name == 'admin')
            
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login'))
    
class protectedIndexView(AdminIndexView):
    def is_accessible(self):
        # return True
        return (current_user.is_authenticated and current_user.name == 'admin')
            
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login'))

admin = Admin(app, name='microblog', index_view=protectedIndexView())
admin.add_view(protectedModelView(User, db.session))
admin.add_link(MenuLink(name='Logout', category='', url='/logout'))
#adminpass123


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
        if (check_password_hash(user.name, password)):
            password = generate_password_hash(password)
            user.password = password
            db.session.commit()
            login_user(user)
            if username == 'admin':
                return redirect('/admin', code='303')
            else:
                return redirect('/findGame', code='303')
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

@app.route("/signup", methods=['POST'])
def signup():
    if( request.method == 'POST' ):
        username = request.form['newusername']
        password = request.form['newpassword']
        password = generate_password_hash(password)
        if( User.query.filter_by(name=username).first() ):
            return redirect(url_for('loginredirect'))
        new_user = User(name=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('signupredirect'))

@app.route("/signup_redirect")
def signupredirect():
    return redirect(url_for('login'))

@app.route("/findGame")
@login_required
def findGame():
    return "test"
    # return render_template('find_games.html')


@app.route("/logout")
def logout():
    if(current_user.is_authenticated):
        logout_user()
    return redirect(url_for('login'))


if __name__ == "__main__":
    app.run()
