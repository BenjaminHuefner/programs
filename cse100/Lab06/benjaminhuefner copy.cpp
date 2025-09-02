#include <iostream>
using namespace std;

void CountingSort(int** A, int n, int instance){
    int** B= (int**)malloc(n*sizeof(int*));//new int*[n];
    int* C= new int[4];
    for(int i =0;i<4;i++){
        C[i]=0;
    }
    for(int j=0;j<n;j++){
        int a=A[j][instance];
        C[a]++;
    }
    for(int i=1;i<4;i++){
        C[i]=C[i]+C[i-1];
        cout<<C[i]<<endl;
    }
    for(int j=n-1;j>=0;j--){
        B[C[A[j][instance]]]=*(A+j);
        C[A[j][instance]]--;
    }
    delete[] C;
    for(int i=0;i<n;i++){
        //*(A+i)=B[i];
    }
    free(B);
}
void RadixSort(int** arr, int n){
    for(int i =9;i>-1;i--){
        CountingSort(arr,n,i);
    }
}

int main(){
    int n;
    cin>>n;
    //int** input= new int*[n];
    int** input=(int**) malloc(n*sizeof(int*));
    for(int i=0;i<n;i++){
        input[i]= (int*) malloc(10*sizeof(int));
    }
    for(int i=0; i<n; i++){
        for(int j=0;j<10;j++){
            cin>>input[i][j];
        }
    }

    RadixSort(input,n);

    for(int i=0; i<n; i++){
        for(int j=0;j<10;j++){
            cout<<input[i][j]<<";";
        }
        free(input[i]);
        cout<<endl;
    }
    free(input);
}