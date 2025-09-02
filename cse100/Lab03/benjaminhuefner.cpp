#include <iostream>
using namespace std;

int SumMaxCrossing(int A[], int i, int j, int mid){
    if(i==j){
        return A[i];
    }
    int leftMax = A[mid];
    int rightMax = A[mid+1];
    int sum = 0;
    for (int k = mid; k >= i; k--){
        sum += A[k];
        if(sum>leftMax){
            leftMax=sum;
        }
    }
    sum = 0;
    for (int k = mid+1; k <= j; k++){
        sum += A[k];
        if(sum>rightMax){
            rightMax=sum;
        }
    }
    return (leftMax + rightMax);
}

int SumMaxArray(int A[], int i, int j){
    if(j<=i){
        return A[i];
    }
    int mid = (i+j)/2;
    int max = SumMaxCrossing(A,i,j,mid);
    int temp = SumMaxArray(A,i,mid);
    if (temp>max){
        max=temp;
    }
    temp= SumMaxArray(A,mid+1,j);
    if (temp>max){
        max=temp;
    }
    return max;
}

int main(){
    int n;
    cin>>n;
    int input[n];
    for(int i=0; i<n; i++){
        cin>>input[i];
    }
    int sum = SumMaxArray(input,0,n-1);
    cout<<sum;
    return 0;
}