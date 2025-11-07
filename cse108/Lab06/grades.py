from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///grades.sqlite"
db = SQLAlchemy(app)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name2 = db.Column(db.String, unique=True, nullable=False)
    grade2 = db.Column(db.Float, nullable=False)

with app.app_context():
    db.create_all()


@app.route("/grades", methods=["GET","POST"])
def allGrades():
    if request.method == "GET":
        # return students
        allStudents=Student.query.all()
        dictionary={}
        for s in allStudents:
            dictionary[s.name2]= s.grade2
        return dictionary
    elif request.method == "POST":
        temp=request.get_json()
        # students[temp["name"]]=temp["grade"]
        db.session.add(Student(name2=temp["name"], grade2=temp["grade"]))
        db.session.commit()
        return temp

@app.route("/grades/<studentName>", methods=["GET","PUT","DELETE"])
def studentGrades(studentName):
    studentNameFixed=studentName.replace("%20"," ")
    if request.method == "GET":
        temp=Student.query.filter_by(name2=studentNameFixed).first()

        # temp=Student.query.get(studentNameFixed)
        if(temp):
            temp={"name":studentNameFixed,"grade":temp.grade2}
            return temp
       

        return Student.query.get(studentNameFixed)
    elif request.method == "PUT":
        # if studentNameFixed in students:
        #     temp=request.get_json()
        #     students[studentNameFixed]=temp["grade"]
        #     temp={"name":studentNameFixed,"grade":students[studentNameFixed]}
        #     return temp
        temp1=Student.query.filter_by(name2=studentNameFixed).first()
        if(temp1):
            temp=request.get_json()
            temp1.grade2=temp["grade"]
            db.session.commit()
            return temp
    elif request.method == "DELETE":
        # if studentNameFixed in students:
        #     del students[studentNameFixed]
        #     return "Deleted"
        db.session.delete(Student.query.filter_by(name2=studentNameFixed).first())
        db.session.commit()
        return "Deleted"
        
if __name__ == "__main__":
    app.run()
