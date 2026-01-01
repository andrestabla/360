
def check_balance(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    stack = []
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        for j, char in enumerate(line):
            if char in '{[(':
                stack.append((char, i + 1, j + 1))
            elif char in '}])':
                if not stack:
                    print(f"Error: Unmatched '{char}' at line {i+1} col {j+1}")
                    return
                last, li, lj = stack.pop()
                expected = {'{': '}', '[': ']', '(': ')'}[last]
                if char != expected:
                    print(f"Error: Mismatched '{char}' at line {i+1} col {j+1}. Expected '{expected}' from line {li} col {lj}")
                    return

    if stack:
        last, li, lj = stack[-1]
        print(f"Error: Unclosed '{last}' from line {li} col {lj}")
    else:
        print("Syntax seems balanced.")

check_balance('app/dashboard/workflows/page.tsx')
