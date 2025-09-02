#include <iostream>
#include <vector>
using namespace std;

int t=0;

struct TwoInts{
  int x,i;
};

int Partition(TwoInts* arr, int p, int r){
  TwoInts pivot=arr[r];
  int i=p-1;
  TwoInts temp;
  for(int j=p;j<r;j++){
      if(arr[j].x<pivot.x){
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

void QuickSort(TwoInts* arr, int p, int r){
  if(p<r){
      int randNum=p+rand()%(r-p+1);
      TwoInts temp=arr[randNum];
      arr[randNum]=arr[r];
      arr[r]=temp;
      int q=Partition(arr,p,r);
      QuickSort(arr,p,q-1);
      QuickSort(arr,q+1,r);
  }
}

void DFS(vector<int>* G, bool* seen, int* f, int v){
  // populate f
  t++;
  seen[v]=true;
    for(int i=0;i<G[v].size();i++){
      if(!seen[G[v][i]]){
        DFS(G, seen,f,G[v][i]);
        t++;
      }
    }
  f[v]=t;
}

void DFS2(vector<int>* G, bool* seen, vector<int>* scc, int v){
  scc->push_back(v);
  seen[v]=true;
    for(int i=0;i<G[v].size();i++){
      if(!seen[G[v][i]]){
        DFS2(G, seen,scc,G[v][i]);
      }
    }
  //
}

int* argsort(int* f,int V){
  int* af= new int[V];
  return af;
}
int min(vector<int>* scc){
  int currMin = (*scc)[0];
  for(int i=1;i<scc->size();i++){
    if((*scc)[i]<currMin){
      currMin=(*scc)[i];
    }
  }
  return currMin;
}

int main(){

  int V; // no. of vertices
  int E; // no. of edges
  cin>>V;
  cin>>E;

  vector<int>* G = new vector<int>[V];
  for(int i = 0; i < E; i++){
    int u,v;
    cin>>u>>v;
    G[u].push_back(v);
  }

  vector<int>* GT = new vector<int>[V];
  for(int i = 0; i < V; i++){
    for(int j = 0; j < G[i].size(); j++){
      int u = i;
      int v = G[i][j];
      GT[v].push_back(u);
    }
  }

  bool* seen = new bool[V];
  for(int i=0;i<V;i++){
    seen[i]=false;
  }
  int* f = new int[V];
  for(int i = 0; i < V; i++){
    if(!seen[i]){
       DFS(G, seen, f, i);
    }
  }

  
  
  //              0  1  2  3  4
  // argsort f = [3, 9, 4, 2, 5]
  // sort:  [2, 3, 4, 5, 9]
  // asort: [3, 0, 2, 4, 1]
  // modify sorting, you can built-in function to do argsort
  TwoInts* temp = new TwoInts[V];
  for(int i=0;i<V;i++){
    temp[i].x=f[i];
    temp[i].i=i;
  }
  QuickSort(temp,0,V-1);
  int* af =new int[V];
  int in;
  for (int i=0;i<V;i++){
    af[i]=temp[V-i-1].i;
  }
  delete[] temp;
  
  for(int i=0;i<V;i++){
    seen[i]=false;
  }
  int* res = new int[V];

  for(int i = 0; i < V; i++){
    int v = af[i];
    if(!seen[v]){
      vector<int>* scc=new vector<int>;
      DFS2(GT, seen, scc, v);
      int sccid = min(scc);
      for(int u : *scc){
         res[u] = sccid;
      }
    }
  }

  for(int i = 0; i < V; i++){
    cout<<res[i]<<endl;
  }

  return 0;
}