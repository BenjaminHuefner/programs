from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

students={}

@app.route("/grades", methods=["GET","POST"])
def allGrades():
    if request.method == "GET":
        return students
    elif request.method == "POST":
        temp=request.get_json()
        students[temp["name"]]=temp["grade"]
        return temp

@app.route("/grades/<studentName>", methods=["GET","PUT","DELETE"])
def studentGrades(studentName):
    studentNameFixed=studentName.replace("%20"," ")
    if request.method == "GET":
        temp={"name":studentNameFixed,"grade":students[studentNameFixed]}
        return temp
    elif request.method == "PUT":
        if studentNameFixed in students:
            temp=request.get_json()
            students[studentNameFixed]=temp["grade"]
            temp={"name":studentNameFixed,"grade":students[studentNameFixed]}
            return temp
    elif request.method == "DELETE":
        if studentNameFixed in students:
            del students[studentNameFixed]
            return "Deleted"
        
if __name__ == "__main__":
    app.run()
