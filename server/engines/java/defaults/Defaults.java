// Test command line arguments and stdin
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        System.out.println("Command line input: " + args[0]);
        
        Scanner Keyboard = new Scanner(System.in);
        String input = Keyboard.next();
        
        System.out.println("Scanned input: " + input);
    }
}