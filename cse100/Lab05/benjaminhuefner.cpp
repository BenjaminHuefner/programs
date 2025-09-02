#include <iostream>
using namespace std;

int Partition(int* arr, int p, int r){
    int pivot=arr[r];
    int i=p-1;
    int temp;
    for(int j=p;j<r;j++){
        if(arr[j]<pivot){
            i++;
            temp= arr[i];
            arr[i]=arr[j];
            arr[j]=temp;
        }
    }
    temp=arr[i+1];
    arr[i+1]=arr[r];
    arr[r]=temp;
    return i+1;
}
void QuickSort(int* arr, int p, int r){
    if(p<r){
        int randNum=p+rand()%(r-p+1);
        int temp=arr[randNum];
        arr[randNum]=arr[r];
        arr[r]=temp;
        int q=Partition(arr,p,r);
        QuickSort(arr,p,q-1);
        QuickSort(arr,q+1,r);
    }
}
int main(){
    int n;
    cin>>n;
    int* input = new int[n];
    for(int i=0; i<n; i++){
        cin>>input[i];
    }
    QuickSort(input,0,n-1);
    for(int k=0; k<n; k++){ //print out sorted list
        cout<< input[k];
        cout<<";";
    }
    delete[] input;
    return 0;
}