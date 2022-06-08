---
title: Installation Guidelines
---

## Prerequisites

If you don't have any of these tools installed already, you will need to:

## Install tools


* Download and install nodejs [https://nodejs.org](https://nodejs.org)
* Download and install npm(command:  npm install npm -g)

**Note**: Make sure you have Node version >= 4.0 and NPM >= 3
## Clone repository and install dependencies

You will need to clone the source code of angular4-baseproject GitHub repository:

```bash
git clone https://git.clicklabs.in/ClickLabs/angular2-baseproject.git
```
After the repository is cloned, go inside of the repository directory and install dependencies:

```bash
cd angular2-baseproject
npm install
```
This will setup a working copy of Angular4-BaseProject on your local machine.

## Running local copy

To run a local copy in development mode, execute:

```bash
npm start
```

Go to http://0.0.0.0:3000 or http://localhost:3000 in your browser.


To run the local copy in production mode and build the sources, execute:

```bash
npm run prebuild:prod && npm run build:prod && npm run server:prod
```

This will clear up your dist folder (where release files are located), generate a release build and start the 
built-in server.
Now you can copy the sources from the `dist` folder and use it with any backend framework or 
simply put it under a web server.

For addition information about creating a build, please check out [Angular2 Webpack Starter documentation](https://github.com/AngularClass/angular2-webpack-starter)

## Running in development mode

```bash
npm start 
```
Go to http://0.0.0.0:3001 or http://localhost:3001 in your browser.