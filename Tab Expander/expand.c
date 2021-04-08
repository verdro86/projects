
#include <stdio.h>
#define MAX_CHAR 999

/* Reads input/file, line by line and translate
  any tab character into spaces. Uses an array 
  to store contents in each lines and reprints
  it*/

int main()
{
  char ch, *p;
  int  char_count, i, count;
 char line_content[MAX_CHAR];
  p = line_content;
  char_count = 0;

  
  /*scan through the whole input/file. The condition
   becomes false when the loop reaches the end of 
   the input/file*/
  while ( scanf("%c", &ch) != EOF)
    {
      /*Checks if ch is the end of the line*/
      if( ch != '\n'){
        if( ch == ' ')
	  count = 0;
	else 
	  count++;
	
      	/*check for tab char*/
	if( ch == '\t'){
          ch = ' ';

	  /*if char # prior to tab char is greater than 8.
	    if so, subtract by 6*/
	  if( count > 8)
	    count -= 6;
	  
	  /*loop through how many spaces need to be allocated
           for the tab char found*/
	  while( count % 8){
	   *p = ' ';
	   p++;
	   char_count++;
	   count++;
	  }
	}
	
	*p = ch;
	char_count++;
	p++;
      }
      
      /*check if its end of the line*/
      if ( ch == '\n' || ch == '\0'){
	p = line_content;
        count = 0;
	
        if( char_count == 0)
          printf("\n");
	
	/*loop through the line contents array */
	for( i = 0; i < char_count ; i++){
	  
	  /*check if at the end of the line*/
	  if( i + 1 == char_count){
	    printf("%c\n", *p);
	    p++;
	  }
	  else{
	    printf("%c", *p);
	    p++;
	  }
	}
	
	char_count = 0;
	p = line_content;
        count = 0;
      }
    }
  return 0;
}
