#include <iostream>
using namespace std;

struct Node{
    Node* neighbor=nullptr;
    int key;
};

struct LinkedList{
    Node* root = nullptr;

    void Insert(int num){
        if(!root){
            root=new Node;
            root->key=num;
        } else {
            Node* temp = root;
            root=new Node;
            root->key=num;
            root->neighbor=temp;
        }
    }

    int Search(int num){
        int i=-1;
        Node* temp=root;
        while(temp){
            i++;
            if(temp->key==num){
                return i;
            }
            temp=temp->neighbor;
        }
        return -1;
    }

    int Delete(int num){
        Node* parent=root;
        Node* node=root;
        if(root){
            if(root->key==num){
                root=root->neighbor;
                delete(node);
                return 1;
            }
            node=root->neighbor;
            Node* child;
            while(node){
                if(node->neighbor){
                    child=node->neighbor;
                }
                else{
                    child=nullptr;
                }
                if(node->key==num){
                    parent->neighbor=child;
                    delete(node);
                    return 1;
                }
                parent=node;
                node=child;
            }
        }
        return 0;
    }

    void Output(){
        Node* node=root;
        while(node){
            cout<<node->key<<"->";
            node=node->neighbor;
        }
        cout<<";"<<endl;
    }
};
struct HashTable{
    LinkedList* table;
    int m;
    HashTable(int tm){
        m=tm;
        table=new LinkedList[m];
    }

    int HashFunction(int k){
        return(k % m);
    }

    void Insert(int k){
        table[HashFunction(k)].Insert(k);
    }

    void Search(int k){
        int i= HashFunction(k);
        int j= table[i].Search(k);
        if(j==-1){
            cout<<k<<":NOT_FOUND;"<<endl;
        } else {
            cout<<k<<":FOUND_AT"<<i<<","<<j<<";"<<endl;
        }
    }

    void Delete(int k){
        int d=table[HashFunction(k)].Delete(k);
        if(d){
            cout<<k<<":DELETED;"<<endl;
        } else {
            cout<<k<<":DELETE_FAILED;"<<endl;
        }
    }

    void Output(){
        for(int i=0;i<m;i++){
            cout<<i<<":";
            table[i].Output();
        }
    }
};



int main(){    
    int m;
    cin>>m;
    HashTable table(m);
    string input;
    cin>>input;
    int num;
    while(input[0]!='e'){
        if(input[0]=='i'){ 
            num= stoi(input.substr(1,input.size()-1));
            table.Insert(num);
        }else if(input[0]=='d'){
            num= stoi(input.substr(1,input.size()-1));
            table.Delete(num);
        } else if(input[0]=='o'){
            table.Output();
        } else if(input[0]=='s'){
            num= stoi(input.substr(1,input.size()-1));
            table.Search(num);
        }

        cin>>input;
    }
}