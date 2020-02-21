---
id: install
title: 💻 Install
---

In this guide we explain how to set up your environment and install QA Wolf.

## TL;DR

- Make sure you have a [basic understanding of the command line](#understand-the-command-line)
- [Install Node.js and `npm`](#install-nodejs-and-npm) if you haven't already
- Install QA Wolf as a dev dependency of your project:

```bash
npm install --save-dev qawolf
```

## Understand the command line

QA Wolf uses the command line interface (CLI) to create and run browser tests. Before moving on, make sure you:

- have a [basic understanding of the command line](https://guide.freecodecamp.org/linux/the-command-prompt)
- have found and opened up the CLI for your computer (instructions for [Mac](https://www.idownloadblog.com/2019/04/19/ways-open-terminal-mac/), [Windows](https://www.lifewire.com/how-to-open-command-prompt-2618089), and [Linux](https://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal/))

## Install Node.js and npm

Node.js is an environment that can execute [JavaScript](https://www.javascript.com/) code. QA Wolf is a [Node.js](https://nodejs.org/en/) library, which requires that you have Node.js installed to run. [`npm`](https://www.npmjs.com/) comes bundled with Node.js and stands for [Node Package Manager](https://www.npmjs.com/). It helps manage the packages that your project needs to run.

Follow [these instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to download and install Node.js and `npm`.

To confirm that you have Node.js and `npm` installed, run the following commands in the CLI:

```bash
node -v
npm -v
```

## Optional: Install Git

[Git](https://git-scm.com/) is a version control system for tracking changes in source code during software development. While not explicitly necessary to run QA Wolf, Git simplifies the process of adding your browser tests to a shared code base. It is also required to run your tests in CI.

The following resources will help you:

- [get a basic understanding of Git](https://guide.freecodecamp.org/git)
- [install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Optional: Understand JavaScript

[JavaScript](https://www.javascript.com/) is the most widely used scripting language in the world. QA Wolf is written in JavaScript (specifically [TypeScript](https://www.typescriptlang.org), a typed superset of JavaScript). When you use QA Wolf to create a browser test, JavaScript code is generated. You don't need to edit or even understand this code to run your tests.

However, having a basic understanding of JavaScript will give you more flexibility to tailor the generated code to your use case. It will also help you debug when things aren't working. Many QA Wolf guides will touch on the generated code, and give you options for how to edit it.

If you'd like to learn the basics of JavaScript, check out [Codecademy's free JavaScript tutorial](https://www.codecademy.com/learn/introduction-to-javascript) and [freeCodeCamp's extensive list of resources](https://guide.freecodecamp.org/javascript/additional-javascript-resources).

## Install QA Wolf

Now that your setup is complete, let's get started with QA Wolf!

QA Wolf is installed as a [dev dependency](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file) in your project. Dev dependencies are packages that are only needed for local development and testing.

To install QA Wolf, either create a new [Node.js](https://nodejs.org/en/) project or change directories into an existing one. To create a new project, run the following in the command line (optionally changing the project name):

```bash
mkdir my-awesome-project
cd my-awesome-project
npm init -y
```

Once you're in your project directory, run the following to install `qawolf` as a dev dependency:

```bash
npm install --save-dev qawolf
```

After the installation is complete, run the following to make sure QA Wolf was installed successfully:

```bash
npx qawolf howl
```

If you're having issues, please [chat with us on Gitter](https://gitter.im/qawolf/community) so we can help troubleshoot.

## Next steps

Congratulations - you're ready to [create browser tests](create_a_test) with QA Wolf! 🎉