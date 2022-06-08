## Angular 4 Project

A basic Angular 4 project utilizing the following technologies:

* Angular 4.0.2
* TypeScript 2.2
* Karma/Jasmine (unit testing)
* Codelyzer & TSLint (code linting)
* PugJS (template engine)
* SASS (css superset)
* Webpack 2+ (build tools)

# Angular 4 Startup
You can use this startup project to start your own Angular 4 project.
This project uses webpack and with only a couple steps you are ready to distribute your project. Let's get started shall we?

# Development
First off all you will need to install some modules, use `npm install` to achieve that.

Now we can get started with developing the app.
Run `npm run start` in order to start the development web server, all your files will be compiled on the fly.

# Production
So you are done developing the app now, so how do you distribute the app you might ask? That's also fairly easy.
Just run `npm run build` and it will compile the whole app for you, when that is done it will be located in the dist folder.

### Commands

* `npm start` - start the development webpack server (access via http://localhost:3001/)
* `npm test` - run the project unit tests (*.spec.ts files)
* `npm run lint` - run the project linting (will be run every time `npm test` is run)
* `npm run build` - generate a production build for the project, which will be inserted into dist/
