---
title: 'Hello World'
date: 2025-02-18T18:40:10
draft: false
---

# Hello World

<aside>
🗒️ You can find the code [here](https://github.com/organiclever/ayokoding/tree/main/contents/fsharp-cookbook/fsharp-cookbook-primary/src/hello_world).

</aside>

```fsharp
printfn "Hello, World!" // Output: Hello, World!
```

Let's break this down:

1. `printfn`: This is a built-in function in F# for outputting formatted text. The `printfn` function is similar to `printf` in other languages like C, but it automatically includes a newline character at the end. It's used here to print text to the console.
2. `"Hello, World!"`: This is a string of characters enclosed in double quotes. It's the argument that `printfn` receives, and it determines what text to print. In this case, the text to be printed is "Hello, World!".
3. `// Output: Hello, World!`: This is a single line comment in F#. The F# compiler ignores anything after the `//` on the same line. It is often used to provide explanations or annotations about the code. Here it is used to indicate the output of the `printfn` line of code. This will not be printed; it's simply a note for people reading the code.

So, to summarise, this line of F# code is a simple command to print the string "Hello, World!" to the console, followed by a comment that explains the expected output.
