---
layout: post
title: "JavaScript Runtime with deno_core"
tags:
  - javascript
  - runtime
  - deno
  - V8
  - web

comments: true
---



> If you're not familiar with Deno, check out the official website at https://deno.land/. In short, Deno is a more secure alternative to Node (the name is literally Node reversed: no_de -> de_no), created by the same founder as Node.

A couple of days ago, the Deno blog published an article titled "Roll your own JavaScript runtime"

> https://deno.com/blog/roll-your-own-javascript-runtime

<!-- more -->

![](/media/16592798557784.jpg)


> I was inspired to write this learning note after reading the article.
> Note: This is not a word-for-word translation, but rather a learning record with minor modifications while preserving the original meaning.
> The "inspiration" came from the fact that about six months ago, I looked at Deno's documentation on Embedding Deno (https://deno.land/manual/embedding_deno), but it didn't have much content—it just pointed to the deno_core documentation (https://crates.io/crates/deno_core) without any getting started tutorial. At the time, my Rust skills weren't strong enough, so I didn't continue exploring.

Without further ado, let's get started.

# Main Content

This article explains how to create a custom JavaScript runtime called runjs. Think of it as a very simple version of Deno. The goal is to develop a command-line program that can execute local JavaScript files, with the ability to read, write, and delete files, plus a console API.

Let's begin.

# Prerequisites

This tutorial assumes you have knowledge of:

- Basic Rust
- Basic understanding of JavaScript event loops

Make sure you have Rust installed (cargo is automatically installed with Rust) with version 1.62.0 or higher. Visit https://www.rust-lang.org/learn/get-started to install it.

```
$ cargo --version
cargo 1.62.0 (a748cf5a3 2022-06-08)
```

# Creating the Project

First, let's create a new Rust project called runjs:

```
$ cargo new runjs
     Created binary (application) package
```

Navigate to the runjs folder and open it in your editor. Make sure everything works:

```
$ cd runjs
$ cargo run
   Compiling runjs v0.1.0 (/Users/ib/dev/runjs)
    Finished dev [unoptimized + debuginfo] target(s) in 1.76s
     Running `target/debug/runjs`
Hello, world!
```

Perfect! Now let's start building our own JavaScript runtime.


# Dependencies

Next, add the dependencies deno_core and tokio:

```
$ cargo add deno_core
    Updating crates.io index
      Adding deno_core v0.142.0 to dependencies.
$ cargo add tokio --features=full
    Updating crates.io index
      Adding tokio v1.19.2 to dependencies.
```

Your `Cargo.toml` file should now look like this:

```
[package]
name = "runjs"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
deno_core = "0.142.0"
tokio = { version = "1.19.2", features = ["full"] }
```

`deno_core` is a Rust crate developed by the Deno team that abstracts the V8 JavaScript engine interface. V8 is a complex project with many APIs. To make V8 easier to use, deno_core provides the `JsRuntime` struct, which wraps a V8 engine instance (also called an Isolate) and supports event loops.

`tokio` is an asynchronous Rust runtime that we'll use to implement the event loop. Tokio can interact with system sockets and the file system. Together, deno_core and tokio enable mapping JavaScript Promises to Rust Futures (i.e., JS async/await maps to Rust async/await).

With a JavaScript engine and an event loop, we can create a JavaScript runtime.

# Hello, runjs!

Now let's write an async Rust function that creates a JsRuntime instance for executing JavaScript:

```
// main.rs
use std::rc::Rc;
use deno_core::error::AnyError;

async fn run_js(file_path: &str) -> Result<(), AnyError> {
  let main_module = deno_core::resolve_path(file_path)?;
  let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
      module_loader: Some(Rc::new(deno_core::FsModuleLoader)),
      ..Default::default()
  });

  let mod_id = js_runtime.load_main_module(&main_module, None).await?;
  let result = js_runtime.mod_evaluate(mod_id);
  js_runtime.run_event_loop(false).await?;
  result.await?
}

fn main() {
  println!("Hello, world!");
}
```

There's a lot to unpack here. The async `run_js` function creates a `JsRuntime` instance that uses a file system-based module loader (`deno_core::FsModuleLoader`). Then, we load a module (`main_module`) with `js_runtime`, evaluate it (`mod_evaluate`), and run an event loop (`run_event_loop`).

The `run_js` function encompasses the entire lifecycle of JavaScript code execution. But first, we need to create a single-threaded tokio runtime to execute the `run_js` function:

```
// main.rs
fn main() {
  let runtime = tokio::runtime::Builder::new_current_thread()
    .enable_all()
    .build()
    .unwrap();
  if let Err(error) = runtime.block_on(run_js("./example.js")) {
    eprintln!("error: {}", error);
  }
}
```

Let's execute some JavaScript code. Create an `example.js` file that outputs "Hello runjs!":

```
// example.js
Deno.core.print("Hello runjs!");
```

> Note: `example.js` is in the project root folder. `cargo run` uses the root folder as the working directory.

![](/media/16592798777424.jpg)



Note that we're using the `print` function from `Deno.core`. `Deno.core` is a globally available built-in object provided by `deno_core`.

Now let's run it:

```
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/runjs`
Hello runjs!⏎
```

Success! We've created a simple JavaScript runtime that can execute local files with just 25 lines of code. Of course, this runtime can't do much yet (for example, it doesn't support `console.log`). We've now integrated the V8 JavaScript engine and tokio into our project.

# Adding the Console API

Let's implement the console API. First, create a `src/runtime.js` file that implements the global console object:

```
// src/runtime.js
((globalThis) => {
  const core = Deno.core;

  function argsToMessage(...args) {
    return args.map((arg) => JSON.stringify(arg)).join(" ");
  }

  globalThis.console = {
    log: (...args) => {
      core.print(`[out]: ${argsToMessage(...args)}\n`, false);
    },
    error: (...args) => {
      core.print(`[err]: ${argsToMessage(...args)}\n`, true);
    },
  };
})(globalThis);
```

> Note: This `runtime.js` file is in the `src` folder.

![](/media/16592798868051.jpg)


The `console.log` and `console.error` functions can accept multiple arguments, serialize them to JSON (so we can view non-native JS objects), and prefix each message with "log" or "error". This is a somewhat "old-school" JavaScript file, like writing JavaScript in the browser before ES modules existed.

We use an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) to execute the code to avoid polluting the global scope. Otherwise, the `argsToMessage` helper function would be globally available in our runtime.

Now let's execute this code every time we run:

```
let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
  module_loader: Some(Rc::new(deno_core::FsModuleLoader)),
  ..Default::default()
});
+ js_runtime.execute_script("[runjs:runtime.js]",  include_str!("./runtime.js")).unwrap();
```

> Note: `include_str!` reads the contents of `runtime.js` from the same directory as `main.rs` (i.e., the `src` directory).

Finally, we can call the new console API in `example.js`:

```
- Deno.core.print("Hello runjs!");
+ console.log("Hello", "runjs!");
+ console.error("Boom!");
```

Run it:

```
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/runjs`
[out]: "Hello" "runjs!"
[err]: "Boom!"
```


# Adding File System APIs

First, update the `runtime.js` file:

```
};

+ globalThis.runjs = {
+   readFile: (path) => {
+     return core.opAsync("op_read_file", path);
+   },
+   writeFile: (path, contents) => {
+     return core.opAsync("op_write_file", path, contents);
+   },
+   removeFile: (path) => {
+     return core.opSync("op_remove_file", path);
+   },
+ };

})(globalThis);
```


We've added a new global object `runjs` with three methods: `readFile`, `writeFile`, and `removeFile`. The first two are async, and the last one is synchronous.

You might be wondering what `core.opAsync` and `core.opSync` are. They're mechanisms provided by `deno_core` to bind JavaScript and Rust functions. When called from JavaScript, `deno_core` will look for a Rust function with the same name marked with the `#[op]` attribute.

Let's update `main.rs` to see it in action:

```
+ use deno_core::op;
+ use deno_core::Extension;
use deno_core::error::AnyError;
use std::rc::Rc;

+ #[op]
+ async fn op_read_file(path: String) -> Result<String, AnyError> {
+     let contents = tokio::fs::read_to_string(path).await?;
+     Ok(contents)
+ }
+
+ #[op]
+ async fn op_write_file(path: String, contents: String) -> Result<(), AnyError> {
+     tokio::fs::write(path, contents).await?;
+     Ok(())
+ }
+
+ #[op]
+ fn op_remove_file(path: String) -> Result<(), AnyError> {
+     std::fs::remove_file(path)?;
+     Ok(())
+ }
```

We've defined three `ops` that JavaScript can call, but to make them available to JavaScript code, we need to register an extension with `JsRuntime`:

```
async fn run_js(file_path: &str) -> Result<(), AnyError> {
    let main_module = deno_core::resolve_path(file_path)?;
+    let runjs_extension = Extension::builder()
+        .ops(vec![
+            op_read_file::decl(),
+            op_write_file::decl(),
+            op_remove_file::decl(),
+        ])
+        .build();
    let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
        module_loader: Some(Rc::new(deno_core::FsModuleLoader)),
+        extensions: vec![runjs_extension],
        ..Default::default()
    });
```

We can configure `JsRuntime` with `Extensions` to expose Rust functions to JavaScript, and do more advanced things (like loading additional JavaScript code).

Update `example.js` again:

```
console.log("Hello", "runjs!");
console.error("Boom!");
+
+ const path = "./log.txt";
+ try {
+   const contents = await runjs.readFile(path);
+   console.log("Read from a file", contents);
+ } catch (err) {
+   console.error("Unable to read file", path, err);
+ }
+
+ await runjs.writeFile(path, "I can write to a file.");
+ const contents = await runjs.readFile(path);
+ console.log("Read from a file", path, "contents:", contents);
+ console.log("Removing file", path);
+ runjs.removeFile(path);
+ console.log("File removed");
+
```

Run it:

```
$ cargo run
   Compiling runjs v0.1.0 (/Users/ib/dev/runjs)
    Finished dev [unoptimized + debuginfo] target(s) in 0.97s
     Running `target/debug/runjs`
[out]: "Hello" "runjs!"
[err]: "Boom!"
[err]: "Unable to read file" "./log.txt" {"code":"ENOENT"}
[out]: "Read from a file" "./log.txt" "contents:" "I can write to a file."
[out]: "Removing file" "./log.txt"
[out]: "File removed"
```


🎉 Congratulations! Our runjs runtime now supports the file system. Notice how we implemented JavaScript calling Rust code with very little code: `deno_core` handles all the communication between JavaScript and Rust.

# Summary

In this brief example, we've implemented a Rust project that integrates a powerful JavaScript engine (V8) with an efficient event loop (tokio).

For the complete example code, check out denoland's GitHub:

> https://github.com/denoland/roll-your-own-javascript-runtime




