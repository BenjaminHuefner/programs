#include <stdio.h>
int main()
{
  int numRep=0;
  int typoLine=0;
  printf("Enter the repetition count for the punishment phrase: ");
  scanf("%d", &numRep);
  while (numRep <= 0){
    printf("You entered an invalid value for the repetition count! Please re-enter: ");
    scanf("%d", &numRep);
  }
  printf("\nEnter the line where you want to insert the typo: ");
  scanf("%d", &typoLine);
  while (typoLine <=0 || typoLine > numRep){
    printf("You entered an invalid value for the typo placement! Please re-enter: ");
    scanf("%d", &typoLine);
  }
  printf("\n");
  for (int i=0; i<numRep; i++){
    if(i!=typoLine-1){
      printf("Coding with C is awesome!\n");
    } else {
      printf("Cading wiht is C avesone!\n");
    }
  }
  return 0;
}
