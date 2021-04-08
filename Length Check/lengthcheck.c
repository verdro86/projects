#include <stdio.h>
#define MAX_CHAR 999

/*Read through input/file line by line, and counts 
  the number of characters in each line*/

int main()
{
  char ch, *p;
  int char_count, i;
  char line_content[MAX_CHAR];
  char_count = 0;

  /*initialize the pointer "p" to the first index
    of the line_content array*/
  p = line_content;


  /*Scans through the input/file line by line*/
  while ( scanf("%c",&ch) != EOF)
    {
      /*Checks the loop is at the end of the line.
       initialize pointer "p" to current char, 
       increments char number and the array index that 
       point "p" is pointing to*/
      if( ch != '\n'){
	*p = ch;
	char_count++;
	p++;
      }
      
      /*check for the end of the line*/
      if( ch == '\n' || ch == '\0'){
	p=line_content;
	
	/*checks if the line doesnt have any content*/
	if( char_count == 0)
	  {
	    printf("%5d: \n", char_count);
	}
	else
	  {
	    
	 /* Check if the number of char in the line
	    is great than 80. print "X" to specify
	    the char number exceeded the max*/
	if( char_count > 80){
	  printf("X %3d: ", char_count);
	  for(i = 0; i < char_count ; i++)
	    {
	      if( i + 1 == char_count)
		{
		printf("%c\n", *p);
		}
	      else
		{
	      printf("%c", *p);
	      p++;
		}
	    }
	}
	
	/*Check if the number of char in the line
	  is less than of equal to 80*/
	if( char_count <= 80){
	  printf("%5d: ", char_count);
	  for( i = 0; i < char_count ; i++)
	    {
	      if(i+1 == char_count)
		{
		printf("%c\n", *p);
		}
	      else
		{
	      printf("%c", *p);
	      p++;
		}
	    }
	}
	  }
	/*reset the character counter and array pointer*/
        char_count = 0;
	p = line_content;
	  
      }
    }
  
  return 0;
}
