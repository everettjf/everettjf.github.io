---
layout: post
title: "Roll Your Own JavaScript Runtime with deno_core"
title_zh: "使用 deno_core 开发一个 JavaScript 运行时"
lang_original: zh
categories:
  - deno
tags:
  - rust
  - deno
comments: true
---



> If you're not familiar with Deno, take a look at the official site first: https://deno.land/ . In short, Deno is a more secure Node (even the name is Node reversed: no_de -> de_no), created by the same founder as Node.

A couple of days ago, the Deno blog published an article titled "Roll your own JavaScript runtime".

> https://deno.com/blog/roll-your-own-javascript-runtime

<!-- more -->

![](/media/16592798557784.jpg)


> Seeing it gave me a bit of an "itch", so today I'll walk through it.
> Note: this is not a word-for-word translation — I make small edits while keeping the original meaning.
> The "itch" comes from the fact that half a year ago I also glanced at the Embedding Deno docs https://deno.land/manual/embedding_deno — but there was basically nothing there, it just pointed me to the deno_core docs https://crates.io/crates/deno_core , which had no getting-started tutorial either. Back then my Rust skills were too weak, so I didn't keep going.

Alright, enough chit-chat — let's begin.

# Introduction

This article shows how to create a custom JavaScript runtime called runjs. Think of it as a very simple Deno. One goal of the article is to build a command-line program that can execute local JavaScript files — reading files, writing files, deleting files — plus a console API.

Let's get started.

# Prerequisites

This tutorial assumes the reader knows the following:

- The basics of Rust
- The basics of the JavaScript event loop

Make sure Rust is installed on your machine (along with cargo, which is installed automatically), at least version 1.62.0. You can install it at https://www.rust-lang.org/learn/get-started .

```
$ cargo --version
cargo 1.62.0 (a748cf5a3 2022-06-08)
```

# Creating the project

First, let's create a new Rust project named runjs:

```
$ cargo new runjs
     Created binary (application) package
```

Enter the runjs folder and open it in your editor. Make sure everything works.

```
$ cd runjs
$ cargo run
   Compiling runjs v0.1.0 (/Users/ib/dev/runjs)
    Finished dev [unoptimized + debuginfo] target(s) in 1.76s
     Running `target/debug/runjs`
Hello, world!
```

Great! Now let's start building our own JavaScript runtime.


# Dependencies

Next, add the dependencies deno_core and tokio.

```
$ cargo add deno_core
    Updating crates.io index
      Adding deno_core v0.142.0 to dependencies.
$ cargo add tokio --features=full
    Updating crates.io index
      Adding tokio v1.19.2 to dependencies.
```

Your `Cargo.toml` should now look like this:

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

`deno_core` is a Rust library (crate) developed by the Deno team that abstracts the interface to the V8 JavaScript engine. V8 is a complex project with many APIs; to make V8 easier to use, deno_core provides the JsRuntime struct, which wraps an instance of the V8 engine (also called an Isolate) and supports an event loop.

`tokio` is an asynchronous Rust runtime that we use to implement the event loop. Tokio is used to interact with the system's sockets and file system. Together, deno_core and tokio let us map JavaScript Promises to Rust Futures (that is, JS async/await maps to Rust async/await).

With a JavaScript engine and an event loop, we can create a JavaScript runtime.

# Hello, runjs!

Now let's write an async Rust function that creates a JsRuntime instance to execute JavaScript.

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

There's a lot to unpack here. The async run_js function creates a JsRuntime instance that uses a file-system-based module loader (deno_core::FsModuleLoader). Then we use js_runtime to load a module (main_module), evaluate it (mod_evaluate), and run an event loop (run_event_loop).

This run_js function contains the entire lifecycle of executing JavaScript code. But first, we need to create a single-threaded tokio runtime to run the run_js function:

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

Let's run some JavaScript code. Create an example.js that prints Hello runjs!:

```
// example.js
Deno.core.print("Hello runjs!");
```

> Note: example.js is in the project's root folder. `cargo run` uses the root folder as the working directory.

![](/media/16592798777424.jpg)



Note that here we used the `print` function from `Deno.core`. `Deno.core` is a globally available built-in object provided by `deno_core`.

Now run it.

```
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/runjs`
Hello runjs!⏎
```

Success! In just 25 lines of code we created a simple JavaScript runtime that can execute a local file. Of course this runtime can't do much yet (for example, it doesn't support console.log). But we've now integrated the V8 JavaScript engine and tokio into our project.

# Adding a console API

Let's start implementing the console API. First create the file `src/runtime.js`, which will implement the global console object.

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

> Note that this runtime.js is in the src folder.

![](/media/16592798868051.jpg)


The console.log and console.error functions accept multiple arguments, serialize them to JSON (so we can view non-primitive JS objects), and prefix each message with log or error. This is a "somewhat old-school" JavaScript file, like writing browser JavaScript before ES modules existed.

We use an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) to run the code so we don't pollute the global scope. Otherwise, the argsToMessage helper would become globally available in our runtime.

Now let's run this code on every startup:

```
let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
  module_loader: Some(Rc::new(deno_core::FsModuleLoader)),
  ..Default::default()
});
+ js_runtime.execute_script("[runjs:runtime.js]",  include_str!("./runtime.js")).unwrap();
```

> Note that include_str! here reads the contents of runtime.js located in the same directory as main.rs (i.e. the src directory).

Finally, we can call the new console API in example.js.

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


# Adding a file system API

First update the runtime.js file:

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


We added a new global object runjs with three methods: readFile, writeFile, and removeFile. The first two are async, and the last one is sync.

You might be wondering what `core.opAsync` and `core.opSync` are — they're the mechanism deno_core provides for binding JavaScript and Rust functions. When they're called from JavaScript, deno_core looks up a Rust function of the same name annotated with the `#[op]` attribute.

Let's update main.rs to see it in action:

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

We defined three `ops` that JavaScript can call, but for the JavaScript code to actually call them, we still need to register an extension with JsRuntime.

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

We can configure JsRuntime through `Extensions` to expose Rust functions to JavaScript, and to do more advanced things (loading additional JavaScript code, etc.).

Update example.js again:

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


🎉 Congratulations — our runjs runtime now supports the file system. Notice how little code it took to call Rust from JavaScript: deno_core handles all the communication between JavaScript and Rust.

# Summary

In this short example, we built a Rust project that integrates a powerful JavaScript engine (V8) and an efficient event loop (tokio).

For the complete example code, see denoland's GitHub:

> https://github.com/denoland/roll-your-own-javascript-runtime

<!--ZH-->



> 如果不了解Deno，可以先看看官网 https://deno.land/ 。简单来说，Deno是一个更安全的Node （名字都是反过来的,no_de -> de_no），和Node是一个创始人。

前两天，Deno博客发布了一篇文章《Roll your own JavaScript runtime》 

> https://deno.com/blog/roll-your-own-javascript-runtime

![](/media/16592798557784.jpg)


> 看到略有“冲动”，今天就给大家翻译一波。
> 注意：翻译不是按字原版翻译，会略做小修改，保持原意不变。
> 所谓“略有冲动”，其实是我半年前也看了一眼Deno文档中的 Embedding Deno https://deno.land/manual/embedding_deno 然而这里啥也木有写，就直接让去看 deno_core 的文档 https://crates.io/crates/deno_core 也木有个入门教程啥的，当时由于我的Rust技术太菜，也就没继续玩耍下去。

好了废话不多说，开始翻译。

# 正文

这篇文章介绍如何创建一个自定义的JavaScript运行时。叫做runjs。可以把它想象成一个非常简单的Deno。这篇文章的一个目标是开发一个命令行程序，实现执行本地的JavaScript文件，可以读文件、写文件、删文件，以及一个console API。

开始咯。

# 必备条件

这篇教程假设读者掌握了以下知识：

- Rust的基础知识
- JavaScript事件循环的基础知识

确保电脑上安装了Rust（和cargo，cargo会自动安装），版本至少1.62.0 。可以访问 https://www.rust-lang.org/learn/get-started 来安装。

```
$ cargo --version
cargo 1.62.0 (a748cf5a3 2022-06-08)
```

# 创建工程

首先，让我们创建一个新的Rust项目，名为runjs：

```
$ cargo new runjs
     Created binary (application) package
```

进入runjs文件夹，并用编辑器打开。确保一切正常。

```
$ cd runjs
$ cargo run
   Compiling runjs v0.1.0 (/Users/ib/dev/runjs)
    Finished dev [unoptimized + debuginfo] target(s) in 1.76s
     Running `target/debug/runjs`
Hello, world!
```

哦啦！现在开始创建咱们自己的JavaScript运行时啦。


# 依赖库

下一步，添加依赖 deno_core 和 tokio 。

```
$ cargo add deno_core
    Updating crates.io index
      Adding deno_core v0.142.0 to dependencies.
$ cargo add tokio --features=full
    Updating crates.io index
      Adding tokio v1.19.2 to dependencies.
```

现在`Cargo.toml`文件的内容应该是下面这样：

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

`deno_core` 是Deno团队开发的一个Rust库（crate），它抽象了V8 JavaScript引擎的接口。V8是一个包含很多API的复杂工程，为了更简单的使用V8，deno_core提供了JsRuntime结构，封装了V8引擎的实例（也叫做Isolate），支持了事件循环。

`tokio`是一个异步Rust运行时，我们用它实现事件循环（event loop）。Tokio可以用来和系统的socket和文件系统交互。deno_core和tokio两者一起可以实现JavaScript的Promise映射到Rust的Future（也就是JS中的async/await映射到Rust的async/await）。

有了JavaScript引擎和一个事件循环之后，我们就能创建一个JavaScript运行时了。

# Hello,runjs!

现在开始写一个异步的Rust函数，创建一个JsRuntime实例用于JavaScript的执行。

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

这里有很多可以展开说的。异步的run_js函数创建了一个JsRuntime实例，这个实例使用了基于文件系统的模块加载器（deno_core::FsModuleLoader）。接着，我们用js_rutime加载了一个模块（main_module），然后执行（mod_evaluate），以及运行起一个事件循环（run_event_loop）。

这个run_js函数包含了JavaScript代码执行的所有生命周期。但首先，我们需要创建一个单线程的tokio运行时来执行run_js函数：

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

让我们开始执行一些JavaScript代码。创建一个example.js，我们让它输出Hello runjs!：

```
// example.js
Deno.core.print("Hello runjs!");
```

> 注意：example.js在工程的根文件夹，cargo run 会让根文件夹作为工作目录(working directory)。

![](/media/16592798777424.jpg)



注意这里我们用了`Deno.core`中的`print`函数，`Deno.core`是`deno_core`提供的一个全局有效的内置对象。

现在运行。

```
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/runjs`
Hello runjs!⏎
```

成功啦！我们仅用了25行代码就创建了一个可以执行本地文件的简单的JavaScript运行时。当然这个运行时现在还做不了太多事情（例如，不支持console.log）。现在我们已经把V8 JavaScript引擎和tokio集成到了我们的工程中。

# 添加console API

让我们开始实现console API。首先创建`src/runtime.js`文件，这个文件可以实现全局的console对象。

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

> 注意，这个runtime.js在src文件夹中。

![](/media/16592798868051.jpg)


console.log和console.error函数可以接受多个参数，序列化为JSON（我们可以这样查看非原生的JS对象），并给每条消息加上前缀log或error。这是个“有点古老”的JavaScript文件了，就像在ES modules诞生之前在写浏览器里的JavaScript代码。

这里用了[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)来执行代码是为了避免污染全局空间。否则，argsToMessage这个辅助函数会在我们运行时里全局有效了。

现在让我们每次运行时都执行这段代码：

```
let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
  module_loader: Some(Rc::new(deno_core::FsModuleLoader)),
  ..Default::default()
});
+ js_runtime.execute_script("[runjs:runtime.js]",  include_str!("./runtime.js")).unwrap();
```

> 注意，这里include_str!是把main.rs同级目录下（也就是src目录下）的runtime.js的内容读取出来。

最后，在example.js中可以调用新增的console API了。

```
- Deno.core.print("Hello runjs!");
+ console.log("Hello", "runjs!");
+ console.error("Boom!");
```

执行：

```
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/runjs`
[out]: "Hello" "runjs!"
[err]: "Boom!"
```


# 添加文件系统API

首先更新runtime.js文件：

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


我们添加了一个新的全局对象runjs，有三个方法：readFile writeFile和removeFile。前两个是异步的，最后一个是同步的。

你估计要纳闷`core.opAsync`和`core.opSync`是什么了，它们是deno_core提供的绑定JavaScript和Rust函数的机制。当JavaScript中调用它们时，deno_core将查找有`#[op]`属性的同名Rust函数。

让我们更新main.rs来看看实际效果：

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

我们定义了三个JavaScript可以调用的`ops`，但是要想让JavaScript代码可以调用，我们还需要给JsRuntime注册一个extension。

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

我们可以通过`Extensions`来配置JsRuntime，暴露Rust函数给JavaScript，还可以做一些更高级的事情（加载额外的JavaScript代码等）。

再次更新example.js：

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

运行它：

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


🎉恭喜，我们的runjs运行时现在支持文件系统了。注意我们这里用了很少的代码就实现了JavaScript调用Rust代码：deno_core把JavaScript和Rust之前的通信都搞定了。

# 总结

在这个简短的例子中，我们实现了一个集成了强大JavaScript引擎（V8）和一个高效事件循环（tokio）的Rust项目。

完整的例子代码，可以参考：denoland's GitHub 

> https://github.com/denoland/roll-your-own-javascript-runtime
