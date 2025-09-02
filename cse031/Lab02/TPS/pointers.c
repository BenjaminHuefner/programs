#include <stdio.h>
int main() {
    int x=0, y=0, *px, *py;
    int arr[10];
    arr[0]=0;
    printf("%d%d%d \n",x,y,arr[0]);
    printf("%p\n%p \n",&x,&y);
    px=&x;
    py=&y;
    printf("%p\n%p \n%p\n%p \n",px,py,&px,&py);

    for(int i=0;i<10;i++){
        printf("%d\n",*(arr+i));
    }
    
    printf("%p\n%p \n",arr,&arr[0]);
    printf("%p \n",&arr);
    return 0;
}