// Sample whiteboard: C++ hilo game
#include <iostream>
#include <limits>
#include <cstdlib>
using namespace std;

int main() {
    int guesses = 0, guess;
    
    cout << "Guess a number between 1 and 20" << endl;
    
    srand(time(0));
    int secret = rand() % 20 + 1;
    
    while(guess != secret) {
        guesses++;
        cin >> guess;
        
        if (cin.fail()) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Try a number..." << endl;
        } else if (guess < secret) {
            cout << "Try higher..." << endl;
        } else if (guess > secret) {
            cout << "Try lower..." << endl;
        }
    }
    
    cout << "Yes! You guessed it in " << guesses << " guesses." << endl;
}