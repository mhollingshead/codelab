# Flatten a nested list structure
a_list = [0, 1, [2, 3], 4, 5, [6, 7]]

def flatten(nestedList):
    result = []
    if not nestedList: return result
    stack = [list(nestedList)]
    while stack:
        current = stack.pop()
        next = current.pop()
        if current: stack.append(current)
        if isinstance(next, list):
            if next: stack.append(list(next))
        else: result.append(next)
    result.reverse()
    return result
    
print(flatten(a_list))

# Eliminate consecutive duplicates of list elements
a_list = [0, 1, 1, 2, 3, 4, 4, 4, 5, 6, 7, 7]

from itertools import groupby
def compress(alist):
    return [key for key, group in groupby(alist)]
    
print(compress(a_list))

# Problem 14: Duplicate the elements of a list
a_list = [0, 1, 2, 3, 4, 5, 6, 7]

def dupli(L):
    return [x for x in L for i in (1,2)]
    
print(dupli(a_list))

# Duplicate the elements of a list a given number of times
def dupli(L, N):
    return [x for x in L for i in range(N)]
      
print(dupli(a_list, 3))


# Drop every N'th element from a list
def drop(L, N):
    return [x for i,x in enumerate(L) if (i+1) % N]

print(drop(a_list, 2))

# Rotate a list N places to the left
def rotate(L, N):
    return L[N:] + L[:N]

print(rotate(a_list, 2))

# Remove the K'th element from a list
def remove_at(L, N):
    return L[N-1], L[:N-1] + L[N:]
    
print(remove_at(a_list, 3))

# Insert an element at a given position into a list
def insert_at(x, L, N):
    return L[:N-1]+[x]+L[N-1:]

print(insert_at(8, a_list, 3))

# Calculate the Greatest Common Divisor (GCD) using Euclid's algorithm
def gcd(a,b):
    while b != 0:
        a, b = b, a%b
    return a

def coprime(a,b):
    return gcd(a,b) == 1

def phi(m):
    if m == 1:
        return 1
    else:
        r = [n for n in range(1,m) if coprime(m,n)]
        return len(r)
        
print(phi(10))

# Generate list of n-bit Gray codes.
def gray(n):
    if n == 0: return ['']
    return ['0'+x for x in gray(n-1)]+['1'+y for y in gray(n-1)[::-1]]

print(gray(3))