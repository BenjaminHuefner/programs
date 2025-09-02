#include <iostream>
using namespace std;

int main(){
    int n;
    cin>>n;
    int input[n];
    for(int i=0; i<n; i++){
        cin>>input[i];
    }
    if(n>0){
        int nSorted=1;
        for(int i=1;i<n;i++){
            int key = input[i];
            int j=i-1;
            while(j>=0 && input[j]>key){
                input[j+1]=input[j];
                j=j-1;
            }
            input[j+1]=key;
            nSorted++;
            //print current sorted
            for(int k=0; k<nSorted; k++){
                cout<< input[k];
                    cout<<";";
            }
            cout<< "\n";
        }  
    }
    return 0;
}