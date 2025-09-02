#include <iostream>
using namespace std;

void Merge(int* arr,int start,int midpoint,int end){
    int nL = midpoint-start +1;
    int nR = end-midpoint;
    int left[nL];
    int right[nR];
    for(int i=0; i<nL;i++){
        left[i]=arr[start+i];
    }
    for(int j=0; j<nR;j++){
        right[j]=arr[midpoint+j+1];
    }
    int i=0;
    int j=0;
    int k=start;
    while(i<nL && j<nR){
        if(left[i]<=right[j]){
            arr[k]=left[i];
            i++;
        } else{
            arr[k]=right[j];
            j++;
        }
        k++;
    }
    while(i<nL){
        arr[k]=left[i];
        i++;
        k++;
    }
    while(j<nR){
        arr[k]=right[j];
        j++;
        k++;
    }
}

void MergeSort(int* arr,int start, int end){
    if(start>=end){
        return;
    }
    int midpoint = (start+end)/2;
    MergeSort(arr,start,midpoint);
    MergeSort(arr,midpoint+1,end);
    Merge(arr,start,midpoint,end);
}

int main(){
    int n; //getting input
    cin>>n;
    // int input[n];
    int* input = new int[n];
    for(int i=0; i<n; i++){
        cin>>input[i];
    }
    MergeSort(input,0,n-1); //mergesort
    for(int k=0; k<n; k++){ //print out sorted list
        cout<< input[k];
        cout<<";";
    }
    delete[] input;
    return 0;
}
