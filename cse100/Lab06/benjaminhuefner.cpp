#include <iostream>
using namespace std;

void CountingSort(int** A, int n, int instance){
    int** B=(int**) malloc(n*sizeof(int*));
    int C[4]={0,0,0,0};
    for(int i=0;i<n;i++){
        C[*(*(A+i)+instance)]++;
    }
    for(int j=1;j<4;j++){
        C[j]+=C[j-1];
    }
    for(int i=n-1;i>=0;i--){
        C[*(*(A+i)+instance)]--;
        *(B+C[*(*(A+i)+instance)])=*(A+i);
    }
    for(int j=0;j<n;j++){
        *(A+j)=*(B+j);
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
    int** input=(int**) malloc(n*sizeof(int*));
    for(int i=0;i<n;i++){
        *(input+i)= (int*) malloc(10*sizeof(int));
    }
    for(int i=0; i<n; i++){
        for(int j=0;j<10;j++){
            cin>>*(*(input+i)+j);
        }
    }

    RadixSort(input,n);

    for(int i=0; i<n; i++){
        for(int j=0;j<10;j++){
            cout<<*(*(input+i)+j)<<";";
        }
        cout<<endl;
    }
    for(int i=0;i<n;i++){
        free(input[i]);
    }
    free(input);
}