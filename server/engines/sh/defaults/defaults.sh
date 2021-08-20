# Function 1
function f1 {
    echo Hello from $FUNCNAME!
    VAR="123"
}

# Function 2
f2() {
    p1=$1
    p2=$2
    sum=$((${p1} + ${p2}))
    echo "${sum}"
}

# Variable from within Function 1
f1
echo ${VAR}

# Using functions
mySum="$(f2 1 2)"
echo mySum = $mySum

mySum="$(f2 10 -2)"
echo mySum = $mySum

# Guessing game
NUMGUESS=0

echo "Guess a number between 1 and 20"

(( secret = RANDOM % 20 + 1 ))

while [[ guess -ne secret ]]
do
    (( NUMGUESS = NUMGUESS + 1 ))
    read -p "Enter guess: " guess

    if (( guess < $secret )); then
        echo "Try higher..."
    elif (( $guess > $secret )); then
        echo "Try lower..."
    fi
done

printf "Yes! You guessed it in $NUMGUESS guesses.\n"