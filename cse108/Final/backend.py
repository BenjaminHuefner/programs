from threading import Lock
from flask import Flask, render_template,redirect, url_for, make_response, session, request, \
    copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None


import json
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
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///checkers.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "supersecretkey"
app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
app.config['SESSION_PERMANENT'] = False
# print(flask_admin.__version__)

socketio = SocketIO(app, async_mode=async_mode, logger=True, engineio_logger=True, cors_allowed_origins="*")
thread = None
thread_lock = Lock()


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
#admin: adminpassuncrackable
#test: testpass123123


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
        username = request.form['username'].strip()
        password = request.form['password'].strip()
        user = User.query.filter_by(name=username).first()
        if (user and check_password_hash(user.password, password)):
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
        username = request.form['newusername'].strip()
        password = request.form['newpassword'].strip()
        if( User.query.filter_by(name=username).first() ):
            return redirect(url_for('loginredirect'))
        password = generate_password_hash(password)
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





def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(10)
        count += 1
        socketio.emit('my_response',
                      {'data': 'Server generated event', 'count': count})


# @app.route('/')
# def index():
#     return render_template('index.html', async_mode=socketio.async_mode)


@socketio.event
def my_event(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']})


@socketio.event
def my_broadcast_event(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']},
         broadcast=True)


@socketio.event
def join(message):
    join_room(message['room'])
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': 'In rooms: ' + ', '.join(rooms()),
          'count': session['receive_count']})


@socketio.event
def leave(message):
    leave_room(message['room'])
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': 'In rooms: ' + ', '.join(rooms()),
          'count': session['receive_count']})


@socketio.on('close_room')
def on_close_room(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response', {'data': 'Room ' + message['room'] + ' is closing.',
                         'count': session['receive_count']},
         to=message['room'])
    close_room(message['room'])


@socketio.event
def my_room_event(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']},
         to=message['room'])


@socketio.on('*')
def catch_all(event, data):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': [event, data], 'count': session['receive_count']})


@socketio.event
def disconnect_request():
    @copy_current_request_context
    def can_disconnect():
        disconnect()

    session['receive_count'] = session.get('receive_count', 0) + 1
    # for this emit we use a callback function
    # when the callback function is invoked we know that the message has been
    # received and it is safe to disconnect
    emit('my_response',
         {'data': 'Disconnected!', 'count': session['receive_count']},
         callback=can_disconnect)


@socketio.event
def my_ping():
    emit('my_pong')


@socketio.event
def connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)
    emit('my_response', {'data': 'Connected', 'count': 0})


@socketio.on('disconnect')
def test_disconnect(reason):
    print('Client disconnected', request.sid, reason)





if __name__ == "__main__":
    app.run()
