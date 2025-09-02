#include <iostream>
using namespace std;

int Parent(int i){
    return ((i+1)/2)-1;
}

int Left(int i){
    return((i*2)+1);
}

int Right(int i){
    return((i*2)+2);
}

void MaxHeapify(int arr[], int i, int heapSize){
    int l = Left(i);
    int r = Right(i);
    int largest=i;
    if(l<heapSize && arr[l]>arr[i]){
        largest=l;
    }
    if(r<heapSize && arr[r]>arr[largest]){
        largest=r;
    }
    if(largest != i){
        int temp = arr[i];
        arr[i]=arr[largest];
        arr[largest]=temp;
        MaxHeapify(arr,largest,heapSize);
    }
}

void BuildMaxHeap(int arr[],int heapSize){
    for(int i=(heapSize/2)-1;i>=0;i--){
        MaxHeapify(arr,i,heapSize);
    }
}

void HeapSort(int arr[],int heapSize){
    BuildMaxHeap(arr,heapSize);
    for(int i = heapSize-1;i>0;i--){
        int temp = arr[0];
        arr[0]=arr[i];
        arr[i]=temp;
        heapSize--;
        MaxHeapify(arr,0,heapSize);
    }
}

int main(){
    int n; //getting input
    cin>>n;
    // int input[n];
    int* input = new int[n];
    for(int i=0; i<n; i++){
        cin>>input[i];
    }
    HeapSort(input,n);
    for(int k=0; k<n; k++){ //print out sorted list
        cout<< input[k];
        cout<<";";
    }
    delete[] input;
    return 0;
}
