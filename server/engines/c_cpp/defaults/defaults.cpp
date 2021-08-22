// Test command line arguments and stdin
#include <stdio.h>

int main( int argc, char *argv[] )  {
    printf("Command line input: %s\n", argv[1]);
    
    char input[20];
    scanf("%[^\n]%*c", input);
    
    printf("Scanned input: %s\n", input);
} 