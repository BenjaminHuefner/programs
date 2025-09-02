#include <iostream>
using namespace std;

struct Node{
    Node* parent=nullptr;
    Node* leftChild=nullptr;
    Node* rightChild=nullptr;
    int key;
};
struct BinarySearchTree{
    Node* root=nullptr;

    void Insert(int k){
        Node* x=root;
        Node* y=nullptr;
        while(x){
            y=x;
            if(k<x->key){
                x=x->leftChild;
            }
            else{
                x=x->rightChild;
            }
        }
        Node* n=new Node;
        n->key=k;
        n->parent=y;
        if(!y){
            root=n;
        } else if(k<y->key){
            y->leftChild=n;
        } else{
            y->rightChild=n;
        }
    }

    void Transplant(Node* u, Node* v){
        if(!u->parent){
            root=v;
        } else if(u==u->parent->leftChild){
            u->parent->leftChild=v;
        } else {
            u->parent->rightChild=v;
        }
        if(v){
            v->parent=u->parent;
        }
    }

    Node* Search(int k){
        Node* node=root;
        while(node && k != node->key){
            if(k<node->key){
                node=node->leftChild;
            } else{
                node=node->rightChild;
            }
        }
        return node;
    }

    Node* Minimum(Node* x){
        while(x->leftChild){
            x=x->leftChild;
        }
        return x;
    }

    void Delete(int k){
        Node* target= Search(k);
        if(target){
            if(!target->leftChild){
                Transplant(target,target->rightChild);
            }else if(!target->rightChild){
                Transplant(target,target->leftChild);
            }else{
                Node* successor=Minimum(target->rightChild);
                if(successor!= target->rightChild){
                    Transplant(successor,successor->rightChild);
                    successor->rightChild=target->rightChild;
                    successor->rightChild->parent=successor;
                }
                Transplant(target,successor);
                successor->leftChild=target->leftChild;
                successor->leftChild->parent=successor;
            }
        }
    }

    void Traverse(int order,Node* subRoot){
        if(subRoot){
            if(order<0){
                cout<<subRoot->key<<endl;
            }
            Traverse(order,subRoot->leftChild);
            if(order==0){
                cout<<subRoot->key<<endl;
            }
            Traverse(order,subRoot->rightChild);
            if(order>0){
                cout<<subRoot->key<<endl;
            }
        }
    }
};



int main(){
    BinarySearchTree tree;
    string input;
    cin>>input;
    while(input[0]!='e'){
        if(input[0]=='i'){
            int num= stoi(input.substr(1,input.size()-1));
            tree.Insert(num);
        }else if(input[0]=='d'){
            int num= stoi(input.substr(1,input.size()-1));
            tree.Delete(num);
        } else if(input[0]=='o'){
            int order=2;
            if(input=="oin"){
                order=0;
            }else if(input=="opre"){
                order=-1;
            }else if(input=="opost"){
                order=1;
            }
            if(order!=2){
                tree.Traverse(order,tree.root);
            }
        }

        cin>>input;
    }
}