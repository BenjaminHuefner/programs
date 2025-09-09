words = input("Please input the word to search for: ").split(" ")
target = words[0]
num=0
with open("PythonSummary.txt","r") as file:
    for i in range(17):    
        words = file.read().split() #modified from lecture code
        for word in words:
            word= word.strip()
            word= word.strip(".!?,()")
            word= word.casefold()
            temp=word.split("-")
            if(not len(temp)==1):
                for part in temp:
                    if (part==target):
                        num+=1
                next
            temp=word.split("/")
            if(not len(temp)==1):
                for part in temp:
                    if (part==target):
                        num+=1
                next
            #print(word)
            if (word==target): 
                num += 1 


print("The word %s occurs %d times" % (target,num))