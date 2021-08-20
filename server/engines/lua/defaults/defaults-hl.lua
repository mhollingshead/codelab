-- Sample whiteboard: Lua HiLo game
guesses = 0
guess = ""

io.write("Guess a number between 1 and 20")

math.randomseed(os.time())
secret = math.floor(math.random(1, 20));

repeat
    guesses = guesses + 1
    io.flush()
    guess = tonumber(io.read())
    
    if guess == nil then
        io.write("Try a number...")
    elseif guess < secret then
        io.write("Try higher...")
    elseif guess > secret then
        io.write("Try lower...")
    end
until guess == secret

io.write("Yes! You guessed it in "..guesses.." guesses.\n")