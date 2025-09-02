#include <iostream>
#include <string>
using namespace std;



struct Character{
    int c;
    int f;
    Character* p;

    Character(){
        c=-1;
        f=0;
        p=nullptr;
    }
};

struct MinQueue{
    Character** arr;
    MinQueue(int n){   
        arr=new Character*[n];
    }

    ~MinQueue(){
        for(int i=0;i<heapSize;i++){
            delete arr[i];
        }
        delete[] arr;
    }
    int heapSize=0;

    void Insert(Character* c){
        arr[heapSize]=c;
        for(int i=heapSize; i>0 && arr[Parent(i)]->f > arr[i]->f;i=Parent(i)){
            Character* temp= arr[Parent(i)];
            arr[Parent(i)]=arr[i];
            arr[i]=temp;
        }

        heapSize++;
    }

    Character* ExtractMin(){
        Character* min= arr[0];
        heapSize--;
        arr[0]=arr[heapSize];
        MinHeapify(0);
        return min;
    }

    int Parent(int i){ return ((i+1)/2)-1; }

    int Left(int i){ return((i*2)+1); }

    int Right(int i){ return((i*2)+2); }

    void MinHeapify(int i){
        int l = Left(i);
        int r = Right(i);
        int smallest=i;
        if(l<heapSize && arr[l]->f<arr[i]->f){
            smallest=l;
        }
        if(r<heapSize && arr[r]->f<arr[smallest]->f){
            smallest=r;
        }
        if(smallest != i){
            Character* temp = arr[i];
            arr[i]=arr[smallest];
            arr[smallest]=temp;
            MinHeapify(smallest);
        }
    }
};


int main(){
    int n=6;
    MinQueue queue(n);
    int ft;
    Character** chars= new Character*[n];
    for(int i=0; i<n; i++){
        cin>>ft;
        chars[i]=new Character;
        chars[i]->f=ft;
        queue.Insert(chars[i]);
    }

    for(int i=0; i<n-1; i++){
        Character* z=new Character();
        Character* x=queue.ExtractMin();
        Character* y=queue.ExtractMin();
        x->p=z;
        y->p=z;
        x->c=0;
        y->c=1;
        z->f=x->f+y->f;
        queue.Insert(z);
    }
    string code;
    int cc;
    char currChar='A';
    Character* curr;
    for(int i=0;i<n;i++){
        code="";
        curr=chars[i];
        cc=curr->c;
        while(cc!=-1){
            code= to_string(cc)+code;
            curr=curr->p;
            cc=curr->c;
        }
        cout<<currChar<<":"<<code<<endl;
        currChar=(char)((int)currChar+1);
    }
    return 0;
}
