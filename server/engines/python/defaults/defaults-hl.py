# Sample whiteboard: Python HiLo game
guesses = 0
guess = ""

print("Guess a number between 1 and 20")

import random
secret = random.randint(1, 20)

while guess != secret:
    guesses = guesses + 1
    guess = int(input())
    
    if guess is None:
        print("Try a number...")
    elif guess < secret:
        print("Try higher...")
    elif guess > secret:
        print("Try lower...")
        
print("Yes! You guessed it in " + str(guesses) + " guesses.\n")