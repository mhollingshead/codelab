(* Find the last element of a list. (easy) *)
let rec last = function
    | [] -> ""
    | [x] -> x
    | _ :: t -> last t;;
    
let () = (Printf.printf "%s " (last ["a" ; "b" ; "c"]));; Printf.printf "\n"

(* Find the number of elements of a list. (easy) *)
let length list =
    let rec aux n = function
      | [] -> n
      | _ :: t -> aux (n + 1) t
    in aux 0 list;;
    
let () = (Printf.printf "%d " (length ["a"; "b"; "c"]));; Printf.printf "\n"

(* Reverse a list. (easy) *)
let rev list =
    let rec aux acc = function
      | [] -> acc
      | h :: t -> aux (h :: acc) t in
    aux [] list;;
    
let () = List.iter (Printf.printf "%s ") (rev ["a"; "b"; "c"]);; Printf.printf "\n"

(* Find out whether a list is a palindrome. (easy) *)
let is_palindrome list =
    list = List.rev list
    
let () = (Printf.printf "%B " (is_palindrome ["x"; "a"; "m"; "a"; "x"]));; Printf.printf "\n"

(* Eliminate consecutive duplicates of list elements. (medium) *)
let rec compress = function
    | a :: (b :: _ as t) -> if a = b then compress t else a :: compress t
    | smaller -> smaller;;
    
let () = List.iter (Printf.printf "%s ") (compress ["a"; "a"; "a"; "a"; "b"; "c"; "c"; "a"; "a"; "d"; "e"; "e"; "e"; "e"]);; Printf.printf "\n"

(* Replicate the elements of a list a given number of times. (medium) *)
let replicate list n =
    let rec prepend n acc x =
      if n = 0 then acc else prepend (n-1) (x :: acc) x in
    let rec aux acc = function
      | [] -> acc
      | h :: t -> aux (prepend n acc h) t in
    (* This could also be written as:
       List.fold_left (prepend n) [] (List.rev list) *)
    aux [] (List.rev list);;
    
let () = List.iter (Printf.printf "%s ") (replicate ["a"; "b"; "c"] 3);; Printf.printf "\n"

(* Rotate a list N places to the left. (medium) *)
let split list n =
    let rec aux i acc = function
      | [] -> List.rev acc, []
      | h :: t as l -> if i = 0 then List.rev acc, l
                       else aux (i - 1) (h :: acc) t  in
    aux n [] list
  
let rotate list n =
    let len = List.length list in
    let n = if len = 0 then 0 else (n mod len + len) mod len in
    if n = 0 then list
    else let a, b = split list n in b @ a;;
    
let () = List.iter (Printf.printf "%s ") (rotate ["a"; "b"; "c"; "d"; "e"; "f"; "g"; "h"] 3);; Printf.printf "\n"

(* Remove the K'th element from a list. (easy) *)
let rec remove_at n = function
    | [] -> []
    | h :: t -> if n = 0 then t else h :: remove_at (n - 1) t;;

let () = List.iter (Printf.printf "%s ") (remove_at 1 ["a"; "b"; "c"; "d"]);; Printf.printf "\n"

(* Insert an element at a given position into a list. (easy) *)
let rec insert_at x n = function
    | [] -> [x]
    | h :: t as l -> if n = 0 then x :: l else h :: insert_at x (n - 1) t;;

let () = List.iter (Printf.printf "%s ") (insert_at "alfa" 1 ["a"; "b"; "c"; "d"]);; Printf.printf "\n"

(* Create a list containing all integers within a given range. (easy) *)
let range a b =
    let rec aux a b =
      if a > b then [] else a :: aux (a + 1) b
    in
      if a > b then List.rev (aux b a) else aux a b;;

let () = List.iter (Printf.printf "%i ") (range 4 9);; Printf.printf "\n"

(* Determine whether a given integer number is prime. (medium) *)
let is_prime n =
    let n = abs n in
    let rec is_not_divisor d =
      d * d > n || (n mod d <> 0 && is_not_divisor (d + 1)) in
    n <> 1 && is_not_divisor 2;;

let () = (Printf.printf "%B " (is_prime 7));; Printf.printf "\n"

(* Calculate Euler's totient function φ(m). (medium) *)
let rec gcd a b =
    if b = 0 then a else gcd b (a mod b);;
    
let coprime a b = gcd a b = 1;;

let phi n =
    let rec count_coprime acc d =
      if d < n then
        count_coprime (if coprime n d then acc + 1 else acc) (d + 1)
      else acc
    in
      if n = 1 then 1 else count_coprime 0 1;;

let () = (Printf.printf "%i ") (phi 10);; Printf.printf "\n"

(* Determine the prime factors of a given positive integer. (medium) *)
let factors n =
    let rec aux d n =
      if n = 1 then [] else
        if n mod d = 0 then d :: aux d (n / d) else aux (d + 1) n
    in
      aux 2 n;;

let () = List.iter (Printf.printf "%i ") (factors 315);; Printf.printf "\n"

(* Create a list of the first N fibonacci numbers (easy) *)
let fib n =
  let rec aux acc n2 n1 = function
  | 1 -> acc
  | c -> aux ((n2 + n1) :: acc) n1 (n2 + n1) (c - 1)
  in
  List.rev(aux [1; 0] 0 1 (n - 1))

let () = List.iter (Printf.printf "%i ") (fib 13);; Printf.printf "\n"