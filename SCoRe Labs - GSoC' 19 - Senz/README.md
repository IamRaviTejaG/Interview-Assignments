# Senz Test
[![Build Status](https://travis-ci.org/ImRaviTejaG/Senz-Test.svg?branch=master)](https://travis-ci.org/ImRaviTejaG/Senz-Test)

### Getting Started
Start by cloning the repository using: `git clone https://github.com/ImRaviTejaG/Senz-Test.git` followed by `cd Senz-Test`.

Install all the dependencies using the `npm install` or `npm i` command. Optionally, use the `--only=dev` flag to install developer dependencies only. Once the dependencies are installed, use `npm start` to start the server.

### Dependencies & Packages
- `@babel/polyfill`
- `@babel/runtime`
- `body-parser`
- `cors`
- `express`
- `morgan`
- `openpgp`

Developer dependencies:
- `@babel/cli`
- `@babel/core` (Transpiling ES6 code for use with NodeJS)
- `@babel/plugin-transform-runtime`
- `@babel/present-env`
- `@babel/register`
- `chai` (Assertion)
- `mocha` (Testing)
- `request`
- `request-promise`
- `rimraf` (The UNIX rm -rf command for Node)
- `standard` (Linting)

### Running locally
#### TL;DR
1. Install all the dependencies. Do the same in the `frontend` directory too.
2. Open two terminal tabs:
    - In one, do `npm start`
    - In another, do `yarn start`

#### npm scripts
The `package.json` file contains four scripts: `linter`, `test`, `build`, `start`.

- `"linter": "standard --fix"`

Runs the StandardJS linter along with the `--fix` flag, which lints code to a great extent. The traceback, if shows up, is the list of errors that need to be fixed manually.

- `"test": "mocha --require @babel/register --exit"`

Runs **only** the tests.

- `"build": "rimraf dist/ && babel . --ignore frontend,node_modules,.babelrc,package.json,npm-debug.log --out-dir dist/ --copy-files"`

Builds the project.

- `"start": "npm run build && node dist/index.js"`

Builds and then starts the server.

### API endpoints
#### 1. `/serverpgpkey`
```
Request type: GET
```
```
Response: Server PGP Public Key
```

#### 2. `/postdata`
```
Request type: POST
Data parameters: filename, encryptedData
```