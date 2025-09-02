#include <stdio.h>
#include <stdlib.h>

 int main() {
	int num;
	int *ptr;
	int **handle;

	num = 14;
	ptr = (int *) malloc(2 * sizeof(int));
	*ptr = num;
	handle = (int **) malloc(1 * sizeof(int *));
	*handle = ptr;

	// Insert code here
	printf("%p\n%p\n%p\n%d\n%p\n%p\n%p",&num,&ptr,&handle,num,ptr,handle,*handle);
	return 0;
} 

