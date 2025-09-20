# Advanced VHS example with more features
Output advanced.gif

# Terminal settings
Set Shell "bash"
Set FontSize 16
Set Width 1400  
Set Height 800
Set Theme "Monokai"
Set Margin 20
Set MarginFill "#1e1e1e"
Set WindowBar "Colorful"

# Show typing effect
Set TypingSpeed 50ms

# Start recording
Hide
Type "clear"
Enter
Show

# Demo various commands
Type "# Welcome to the VHS Advanced Demo" Sleep 1s Enter
Sleep 500ms

Type "echo 'Let me show you some cool terminal commands...'" Sleep 300ms Enter  
Sleep 2s

Type "# First, let's see what's in this directory" Sleep 500ms Enter
Type "ls -la --color=always" Sleep 800ms Enter
Sleep 3s

Type "# Now let's create a simple file" Sleep 500ms Enter
Type "echo 'Hello from VHS!' > hello.txt" Sleep 800ms Enter
Sleep 1s

Type "cat hello.txt" Sleep 500ms Enter
Sleep 2s

Type "# Let's check our git status" Sleep 500ms Enter
Type "git status --short" Sleep 800ms Enter
Sleep 3s

Type "# And clean up" Sleep 500ms Enter
Type "rm hello.txt" Sleep 500ms Enter
Sleep 1s

Type "echo 'Thanks for watching!'" Sleep 1s Enter
Sleep 2s