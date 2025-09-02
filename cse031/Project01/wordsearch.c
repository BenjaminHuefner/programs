#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Declarations of the two functions you will implement
// Feel free to declare any helper functions or global variables
int* ans; // ans will store the coordinates of solutions I find as x, y 
int numAns=0;
int ansSize=0;
int ansCap=0;
int wordSize=0;
void resize();
void printPuzzle(char** arr);
int charEquality(char a, char b);
int charInArr(char c, char* word);
void printPuzzleAns(char** arr, char* word);
int searchWord(char** arr, int x, int y, char* word, int index);
void searchPuzzle(char** arr, char* word);
int bSize;

// Main function, DO NOT MODIFY 	
int main(int argc, char **argv) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <puzzle file name>\n", argv[0]);
        return 2;
    }
    int i, j;
    FILE *fptr;

    // Open file for reading puzzle
    fptr = fopen(argv[1], "r");
    if (fptr == NULL) {
        printf("Cannot Open Puzzle File!\n");
        return 0;
    }

    // Read the size of the puzzle block
    fscanf(fptr, "%d\n", &bSize);
    
    // Allocate space for the puzzle block and the word to be searched
    char **block = (char**)malloc(bSize * sizeof(char*));
    char *word = (char*)malloc(20 * sizeof(char));

    // Read puzzle block into 2D arrays
    for(i = 0; i < bSize; i++) {
        *(block + i) = (char*)malloc(bSize * sizeof(char));
        for (j = 0; j < bSize - 1; ++j) {
            fscanf(fptr, "%c ", *(block + i) + j);            
        }
        fscanf(fptr, "%c \n", *(block + i) + j);
    }
    fclose(fptr);

    printf("Enter the word to search: ");
    scanf("%s", word);
    
    // Print out original puzzle grid
    printf("\nPrinting puzzle before search:\n");
    printPuzzle(block);
    
    // Call searchPuzzle to the word in the puzzle
    searchPuzzle(block, word);
    
    return 0;
}

void printPuzzle(char** arr) {
	// This function will print out the complete puzzle grid (arr). 
    // It must produce the output in the SAME format as the samples 
    // in the instructions.
    // Your implementation here...
    for (int y=0;y<bSize;y++){
        for(int x=0;x<bSize;x++){
            printf("%c ",*(*(arr+y)+x));
        }
        printf("\n");
    }
    
    printf("\n");
}

int charInArr(char c, char* word){
    for (int i=0;i<wordSize;i++){
        if(charEquality(c,*(word+i))){
            return 1;
        }
    }
    return 0;
}

void printPuzzleAns(char** arr, char* word) {
    int output;
    printf("Printing the search path:\n");
    for (int y=0;y<bSize;y++){
        for(int x=0;x<bSize;x++){
            output=0;
            if(charInArr(*(*(arr+y)+x),word)){
                for(int i=0;i<2*numAns*wordSize;i+=2){
                    if(x==*(ans+i) && y==*(ans+i+1)){
                        output=((i/2)+1)%wordSize;
                        if(output==0){
                            output=wordSize;
                        }
                        printf("%d",output);
                    }
                }
                if(!output){   
                    printf("0");
                }
                printf("\t");
            }else{
                printf("0\t");
            }
        }
        printf("\n");
    }

}

int charEquality(char a, char b){
    if(a==b){
        return 1;
    }
    if(a>64&&a<91){
        if(a==(b-32)){
            return 1;
        }
    }
    if(b>64&&b<91){
        if(b==(a-32)){
            return 1;
        }
    }
    return 0;
}

int searchWord(char** arr, int initX, int initY, char* word, int index){
    if(index==wordSize-1){
        *(ans+(2*index)+numAns*2*wordSize)=initX;
        *(ans+(2*index)+numAns*2*wordSize+1)=initY;
        return 1;
    }
    index++;
    for (int y=initY-1;y<=initY+1;y++){
        for(int x=initX-1;x<=initX+1;x++){
            if(y>=0 && y<bSize && x>=0 && x<bSize && !(x==initX && y==initY)){
                if(charEquality(*(*(arr+y)+x),*(word+index))){
                    if(searchWord(arr,x,y,word,index)){
                        *(ans+(2*(index-1))+numAns*2*wordSize)=initX;
                        *(ans+(2*(index-1))+numAns*2*wordSize+1)=initY;
                        return 1;
                    } 
                }
            }
        }
    }
    return 0;
    
}

void searchPuzzle(char** arr, char* word) {
    // This function checks if arr contains the search word. If the 
    // word appears in arr, it will print out a message and the path 
    // as shown in the sample runs. If not found, it will print a 
    // different message as shown in the sample runs.
    // Your implementation here...  
    wordSize= strlen(word);
    ansSize= 2*ansCap*wordSize;
    ans = (int *) malloc(ansSize*sizeof(int));
    if(wordSize<1){
        free(ans);
        printf("Invalid Word\n");
        return;
    }
    for (int y=0;y<bSize;y++){
        for(int x=0;x<bSize;x++){
            if(charEquality(*(*(arr+y)+x),*(word))){
                if(searchWord(arr,x,y,word,0)){
                    numAns++;
                    if(numAns==ansCap){
                        resize();
                    }
                }
            }
        }
    }
    if(numAns){
        printf("Word found!\n");
        printPuzzleAns(arr,word);
    } else {
        printf("Word not found!\n");
    }
    free(ans);
}

void resize(){
    int* temp = (int *) malloc(2*ansSize*sizeof(int));
    for(int i=0;i<ansSize;i++){
        *(temp+i) + *(ans+i);
    }
    free(ans);
    ans=temp;
    ansSize*=2;
    ansCap*=2;
}