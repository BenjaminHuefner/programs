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
import random
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

class Game(db.Model):
    __tablename__ = 'games'
    id = db.Column(db.Integer, primary_key=True)
    player1_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    player2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, default=None)
    code = db.Column(db.String, nullable=True, default=None)
    numplayers = db.Column(db.Integer, nullable=False, default=0)
    player1color = db.Column(db.Integer, nullable=False, default=0)# 1:black 2:red
    currTurn = db.Column(db.Integer, nullable=False, default=1)# 1:black 2:red
    winner = db.Column(db.Integer, nullable=False, default=0) # 0:none 1:black 2:red
    state = db.Column(db.JSON, nullable=False)

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
admin.add_view(protectedModelView(Game, db.session))
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
    # return "test"
    return render_template('find_games.html')


@app.route("/getGames")
@login_required
def getGames():
    allGames=[]
    games = Game.query.filter_by(numplayers=1).all()
    for game in games:
        host = User.query.filter_by(id=game.player1_id).first()
        if(game.code is not None):
            codeRequired = True
        else:
            codeRequired = False
        allGames.append( {"username": host.name, "codeReq": codeRequired} )

    if(allGames is not None):
        return json.dumps(allGames)
    return "0"

@app.route("/createGame", methods=['POST'])
@login_required
def createGame():
    if request.is_json:
        data = request.get_json()
        codeRequired = data.get('codeRequired', False)
        gameCode = data.get('gameCode', None)
        if( (not Game.query.filter_by(player1_id=current_user.id).first()) and (not Game.query.filter_by(player2_id=current_user.id).first()) ):
            newGame= Game(player1_id=current_user.id, numplayers=1, state={})
            if codeRequired:
                newGame.code=gameCode
            if random.random()>=0.5:
                newGame.player1color=1
            else:
                newGame.player1color=2
            newGame.currTurn=1
            initGame=[]
            for i in range(1,7):
                for j in range(1,5):
                    # initGame.append({"x": } )
                    offset= i%2
                    if(i<4):
                        initGame.append({"x": i, "y": (2*(j-1))+offset+1, "color": 1,"captured": False,"king": False, "multicapture": False})
                    else:
                        initGame.append({"x": i+2, "y": (2*(j-1))+offset+1, "color": 2, "captured":False,"king": False, "multicapture": False})
                    
            state=json.dumps(initGame)
            newGame.state=state
            db.session.add(newGame)
            print("test")
            db.session.commit()
            return "2"
        return "0" 
    return "0"

@app.route("/joinGame", methods=['POST'])
@login_required
def joinGame():
    if request.is_json:
        data = request.get_json()
        hostName = data.get('hostName')
        gameCode = data.get('gameCode', None)
        if( (not Game.query.filter_by(player1_id=current_user.id).first()) and (not Game.query.filter_by(player2_id=current_user.id).first()) ):
            hostUser = User.query.filter_by(name=hostName).first()
            game = Game.query.filter_by(player1_id=hostUser.id, numplayers=1).first()
            if(game is None):
                print("no game")
                return "1"
            if(game.code is not None):
                if(game.code != gameCode):
                    print("wrong code")
                    return "0"
            print("test2")
            game.player2_id=current_user.id
            game.numplayers=2
            db.session.commit()
            return "2"
        return "0" 
    return "0"

    # return "test"


@app.route("/game_redirect")
def game_redirect():
    return redirect(url_for('game'))

@app.route("/game", methods=['POST', 'GET'])
@login_required
def game():
    # return "test"
    return render_template('game.html')
    # return "test"

@app.route("/logout")
def logout():
    if(current_user.is_authenticated):
        logout_user()
    return redirect(url_for('login'))

@socketio.on('connect')
def handle_connect():
    if current_user.is_authenticated:
        print(f'Client connected')
        emit('connected', {'message': 'Successfully connected to server'})
    else:
        print(f'Unauthenticated client attempted to connect')
        return False  # Disconnect unauthenticated clients

@socketio.on('join')
def startConnection():
    game = Game.query.filter( ( (Game.player1_id==current_user.id) | (Game.player2_id==current_user.id) )).first()
    if game is not None:
        join_room(str(game.id))
        if(game.player1_id == current_user.id):
            playerColor = game.player1color
            if(game.numplayers==1):
                emit('joined','1'+str(playerColor)+'0'+str(game.id),room=str(game.id))
            else:
                emit('joined','1'+str(playerColor)+'1'+str(game.id),room=str(game.id))
        elif(game.player2_id == current_user.id):
            if(game.player1color == 1):
                playerColor = 2
            else:
                playerColor = 1
            emit('joined','2'+str(playerColor)+'1'+str(game.id),room=str(game.id))


    print(f'Client joined')

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected')


if __name__ == "__main__":
    socketio.run(app)
