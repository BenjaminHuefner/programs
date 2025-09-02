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
    W[i] = new int[E];
  }

  vector<int>* G = new vector<int>[V];
  for(int i = 0; i < E; i++){
    int u,v,w;
    cin>>u>>v>>w;
    W[u][v] = w;
    G[u].push_back(v);
  }
  
  // INITIALIZE-SINGLE -SOURCE
  int* dist = new int[V];
  for(int i = 0; i < V; i++){
    dist[i] = INT_MAX;
  }
  dist[0] = 0;

  for(int i = 0; i < V-1; i++){
    for(int u = 0; u < V; u++){
      for(int v : G[u]){
        // relax given u,v,W[u][v], dist: suggestion - implement it right here (no need to declare function)
        if (dist[u]!=INT_MAX && dist[v] > dist[u] + W[u][v]){
          dist[v] = dist[u] + W[u][v];
        }
      }
    }
  }

  for(int u = 0; u < V; u++){
    for(int v : G[u]){
      if (dist[u]!=INT_MAX && dist[v] > dist[u] + W[u][v]){
        cout << "FALSE" << endl;
        return 0;
      }
    }
  }
  cout << "TRUE" << endl;
  // print out array 'dist'
  for(int i=0;i<V;i++)
  if (dist[i] == INT_MAX){ 
     cout << "INFINITY" << endl;
  }else{
    cout << dist[i] << endl;
  } 

  return 0;
}


