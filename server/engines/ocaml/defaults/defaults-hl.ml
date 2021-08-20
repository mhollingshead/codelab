(* Sample whiteboard: OCaml HiLo game *)
Random.self_init ();;

let rec hilo n guesses =
    let i = read_int () in 
        if i = n then 
            Printf.printf "Yes! You guessed it in %i guesses." guesses
        else 
            let () = 
                if i < n then 
                    Printf.printf "Try higher..."
                else if i > n then
                    Printf.printf "Try lower..."
                else Printf.printf "Try a number..."
            in hilo n (guesses + 1) ;;

Printf.printf "Guess a number between 1 and 20";;          
hilo ((Random.int 19) + 1) 1;;