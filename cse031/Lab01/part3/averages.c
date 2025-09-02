#include <stdio.h>
#include <stdlib.h>
int oddDigits(int input){
    input=abs(input);
    int sum=0;
    int lastDigit;
    while(input!=0){
        lastDigit=input%10;
        sum +=lastDigit;
        input-=lastDigit;
        input/=10;

    }
    if(sum%2==1){
        return 1;
    }
    return 0;
}
int main(){
    int input=1,numEven=0,numOdd=0,sumOdd=0,sumEven=0,count=1;
    while (input){
        if(count%10 ==1 && count%100 != 11){
            printf("Enter the %dst value: ",count);
        }else if(count%10 ==2 && count%100 != 12){
            printf("Enter the %dnd value: ",count);
        }else if(count%10 ==3 && count%100 != 13){
            printf("Enter the %drd value: ",count);
        }else{
            printf("Enter the %dth value: ",count);
        }
        count++;
        scanf("%d", &input);
        int isOdd=oddDigits(input);
        if(input != 0){
            if(isOdd){
                numOdd++;
                sumOdd+=input;
            }else{
                numEven++;
                sumEven+=input;
            }
        }    
    }
    printf("\n");
    if(!numEven && !numOdd){
        printf ("There is no average to compute.\n");
    }else{
        float avgEven= (float)sumEven/(float)numEven;
        float avgOdd= (float)sumOdd/(float)numOdd;
        if(numEven){
            printf("Average of input values whose digits sum up to an even number: %.2f\n", avgEven);
        }
        if(numOdd){
            printf("Average of input values whose digits sum up to an odd number: %.2f\n", avgOdd);
        }
    }
    return 0;
}
