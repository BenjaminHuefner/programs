sentence= input("Enter the sentence to be repeated: ")
times = int(input("Enter the number of times it is to be repeated: "))
with open("CompletedPunishment.txt","w") as file:
    for i in range(times):
        file.write(sentence+"\n")
    