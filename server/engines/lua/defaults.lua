function arrToString(arr)
    str = "{"
    for i = 1, #arr do
        if i < #arr then
            str = str .. tostring(arr[i]) .. ", "
        else
            str = str .. tostring(arr[i])
        end
    end
    return str .. "}"
end

-- Beginner challenge:
-- write a function that can add any two numbers.

function add(n1, n2) 
    return n1 + n2
end 
print(add(9, 10))


-- Beginner challenge:
-- backwards for loop. print out all numbers in an array, backwards.
-- extra: create a new array with reversed values

function reverseArr(arr)
    for i = #arr, 1, -1 do
        print(arr[i])
    end
end

reverseArr({0, 1, 2, 3, 4, 5})


-- Beginner challenge:
-- Add all numbers in an array

function sumArr(arr)
    sum = 0
    for i = 1, #arr do
        sum = sum + arr[i]
    end
    return sum
end

print(sumArr({0, 1, 2, 3, 4, 5}))


-- Beginner challenge:
-- Add all the even numbers in the array

function sumEvenArr(arr)
    sum = 0
    for i = 1, #arr do
        if arr[i] % 2 == 0 then
            sum = sum + arr[i]
        end
    end
    return sum
end

print(sumEvenArr({0, 1, 2, 3, 4, 5}))


-- Beginner Challenge:
-- find the sum of all positive integers in an array

function sumPositiveArr(arr)
    sum = 0
    for i = 1, #arr do
        if arr[i] > 0 then
            sum = sum + arr[i]
        end
    end
    return sum
end

print(sumPositiveArr({0, 1, -2, 3, -4, 5}))


-- Beginner Challenge:
-- Find all even numbers in an array, that are also divisible by 4, evenly.

function divisibleBy4(arr)
    filtered = {}
    for i = 1, #arr do
        if arr[i] % 4 == 0 then
            table.insert(filtered, arr[i])
        end
    end
    return filtered
end

print(arrToString(divisibleBy4({1, 8, 7, 4, -3, 2, 10, 12})))


-- Beginner challenge:
-- for every number divisible by 3, print 'spicy'
-- for every number divisible by 5, print 'Peas'
-- for every number divisble by 3 and 5, print 'spicyPeas'
-- for every other number, print it directly

function spicyPeas()
    for i = 1, 20 do
        if i % 3 == 0 and i % 5 == 0 then
            print("spicyPeas")
        elseif i % 3 == 0 then
            print("spicy")
        elseif i % 5 == 0 then
            print("Peas")
        else
            print(tostring(i))
        end
    end
end

spicyPeas()


-- Beginner challenge:
-- find the missing number in an array that has the numbers 1-9

function findMissingNumber(arr)
    for i = 1, #arr do
        if not (arr[i+1] == arr[i] + 1) then
            return i + 1
        end
    end
end

print(findMissingNumber({1, 2, 3, 4, 6, 7, 8, 9}))