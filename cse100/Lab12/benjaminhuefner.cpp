#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int main(){

  int V; // no. of vertices
  int E; // no. of edges
  cin>>V;
  cin>>E;

  int** W = new int*[V];
  for(int i = 0; i < V; i++){
    W[i] = new int[V];
  }

  vector<int>* G = new vector<int>[V];
  for(int i = 0; i < E; i++){
    int u,v,w;
    cin>>u>>v>>w;
    W[u][v] = w;
    W[v][u] = w;
    G[u].push_back(v);
    G[v].push_back(u);
  }

  int c=V;
  int* parents = new int[V];
  int* keys = new int[V];
  int* contains = new int[V];
  for(int i = 0; i < V; i++){
    parents[i] = -1;
    keys[i] = INT_MAX;
    contains[i]=1;
  }

  // set keys[i] to 0
  keys[0]=0;
  // put all v into Q

  while(c>0){
    // find vertex which has min in keys: for loop in Q
    int u= -1;
    for(int i=0;i<V;i++){
      if (contains[i]){
        if(u==-1){
          u=i;
        }else if(keys[i]<keys[u]){
          u=i;
        }
      }
    }
    // remove element at index 'u' from Q
    contains[u]=0;
    c--;
    // for(int v : G[u]){
   for(int i = 0; i < G[u].size(); i++){
      int v = G[u][i];
      if(contains[v] && W[u][v] < keys[v]){
        parents[v] = u;
        keys[v] = W[u][v];
      }
    }
  }
  
  // print parents from index 1
  for(int i=1;i<V;i++){
    cout<<parents[i]<<endl;
  }
  return 0;
}















