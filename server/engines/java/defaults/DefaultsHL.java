// Sample whiteboard: Java hilo game
import java.util.Random;
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        int guesses = 0, guess = 0;
        
        System.out.println("Guess a number between 1 and 20");
        
        Scanner Keyboard = new Scanner(System.in);
        Random generator = new Random();
        int secret = generator.nextInt(20) + 1;
        
        while (guess != secret) {
            guesses++;
            guess = Keyboard.nextInt();
            
            if (guess < secret) {
                System.out.println("Try higher...");
            } else if (guess > secret) {
                System.out.println("Try lower...");
            }
        }
        
        System.out.println("Yes! You guessed it in " + guesses + " guesses.");
    }
}