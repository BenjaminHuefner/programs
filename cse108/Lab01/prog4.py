class StudentClass:
    def __init__(self,i,cDep,cNum,cName,credits,days,start,end,stat):
        self.i=i
        self.cDep=cDep
        self.cNum=cNum
        self.cName=cName
        self.credits=credits
        self.days=days
        self.start=start
        self.end=end
        self.stat=stat
    
    def formattedContents(self):
        return "Course %s: %s%s: %s\nNumber of Credits: %s\nDays of Lectures: %s\nLectureTime: %s - %s\nStat: On average, students get %s%% in this course\n\n"%(self.i+1,self.cDep,self.cNum,self.cName,self.credits,self.days,self.start,self.end,self.stat)
    
    def formattedFile(self,file):    
        file.write(self.formattedContents())

classes=[]
with open("classesInput.txt","r") as file:
    numClasses= int(file.readline())
    for i in range(numClasses):
        cDep=file.readline().strip()
        cNum=file.readline().strip()
        cName=file.readline().strip()
        credits=file.readline().strip()
        days=file.readline().strip()
        start=file.readline().strip()
        end=file.readline().strip()
        stat=file.readline().strip()
        classes.append(StudentClass(i,cDep,cNum,cName,credits,days,start,end,stat))
with open("ClassResults.txt","w")as file:    
    for cl in classes:
        cl.formattedFile(file)
                