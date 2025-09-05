nums= input("Enter two or more numbers seperated by spaces: ").split(" ")
sum = 0
if (len(nums)<2):
    raise Exception("Not enough inputs")
for num in nums:
    try:
        sum+= float(num)
    except:
        raise ValueError("Incorrect input type")
if(int(sum)==sum):
    sum=int(sum)
print(sum)