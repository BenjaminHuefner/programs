import json

def loadGrades(grades):
    with open("grades.txt","r") as file:
        grades=json.load(file)
        print(grades)
    return grades

def updateGrades(grades):
    with open("grades.txt","w") as file:
        jsonStr=json.dumps(grades)
        file.write(jsonStr)

def newGrade(grades):
    name=input("Enter Student Name: ")
    grade=float(input("Enter Student Grade: "))
    test=findGrade(grades,name)
    if(test=="-1"):
        if(grade<=100.0 and grade>=0.0):
            grades[name]=grade
            print("Student Added Successfully\n")
            updateGrades(grades)
        else:
            print("Invalid Grade\n")
    else:
        print("Student Already in System\n")
    return grades

def editGrade(grades):
    name=input("Enter Student Name: ")
    test=findGrade(grades,name)
    if(not test=="-1"):
        grade=float(input("Enter New Student Grade: "))
        if(grade<=100.0 and grade>=0.0):
            grades[name]=grade
            print("Grade Updated Successfully\n")
            updateGrades(grades)
        else:
            print("Invalid Grade\n")
    else:
        print("Student Not in System\n")
    return grades

def deleteGrade(grades):
    name=input("Enter Student Name: ")
    test=findGrade(grades,name)
    if(not test=="-1"):
        del(grades[name])
        print("Grade Deleted Successfully\n")
        updateGrades(grades)
    else:
        print("Student Not in System\n")
    return grades

def findGrade(grades,key):
    grade=grades.get(key,"-1")
    return grade

def selector(grades):
    selection=input("Enter your selection:\n1: Add a new entry\n2: Edit an existing entry\n3: Delete an entry\n4: Find existing entry\n5: Exit\n")
    if(selection=="1"):
        cont="Y"
        while(cont=="Y"):
            grades=newGrade(grades)
            cont=input("Continue? Y/N : ")

        grades=selector(grades)
    elif(selection=="2"):
        cont="Y"
        while(cont=="Y"):
            grades=editGrade(grades)
            cont=input("Continue? Y/N : ")

        grades=selector(grades)
    elif(selection=="3"):
        cont="Y"
        while(cont=="Y"):
            grades=deleteGrade(grades)
            cont=input("Continue? Y/N : ")

        grades=selector(grades)
    elif(selection=="4"):
        cont="Y"
        while(cont=="Y"):
            name=input("Enter the student's full name: ")
            grade=findGrade(grades,name)
            if(grade=="-1"):
                print("Student not found\n")
            else:
                print("%s's grade is %s\n"%(name,grade))
            cont=input("Continue? Y/N : ")
        grades=selector(grades)
    elif(not selection=="5"):
        print("Invalid Selection\n")
        grades=selector(grades)
    return grades
grades={}        
grades=loadGrades(grades)
grades=selector(grades)
updateGrades(grades)
