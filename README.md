# Configuring NPM Package




## Helpful Resource
This [link](https://blog.logrocket.com/the-complete-guide-to-publishing-a-react-package-to-npm/) explains the basics of using rollup for configuring a react/NPM package. I found the beginning pieces of information here. 



## NPM
The original scope of this assignment was to move the iwaker code into a portable package hosted on NPM repository so that it could be distributed to different projects easily and handed to other developers. As of right now, there is no way that I can find to authenticate command line actions (such as npm install or npm update). Ideally an auth token should be stored in the .npmrc file however the only way this can be used (from what I can see) is to call this using an automated workflow which is not ideal. Another solution pursued was simply pulling the package from GitHub. However this breaks the update (npm update) functionality (see [this](https://medium.com/@jonchurch/use-github-branch-as-dependency-in-package-json-5eb609c81f1a) for more info). There are some other NPM repositories available. 



## Package Components

### Rollup
Rollup is an NPM package that is big used to take the package and complete two tasks: compile the code back down to ES5 so that all browsers can understand it, and “tree-shake” the code so that additional functions that are not used are emitted from the final package”. There are also a few plugins that have been added to rollup.

#### Commands 
In the package.json file, there are two commands that have to do with rollup: build and start. These can be run using the shell command “npm run build” or “npm run start”. The former manually builds the package when run and the latter starts a process that continuously builds the package every time it is saved, which can be very useful. 

### Typescript2 Plugin
This is a simple plugin Rollup which allows for rollup to understand Typescript files. 

### SASS Plugin
This allows for Rollup to understand sass and other files. 

### Bable Plugin
This is not currently added but it might be necessary if any normal javascript files are put in. I am not sure though



## Files & Directories

### rollup.config.js
This is the configuration file for rollup. See [this](https://rollupjs.org/guide/en/#creating-your-first-bundle) for more info. 

### tsconfig,json
This is the configuration file for the typescript plugin. [This](https://www.typescriptlang.org/docs/handbook/compiler-options.html) lists all of the options for this file.

### src
This is the directory where all of the code package code goes.

### dist 
When rollup runs, all of the generated files are dumped in here. It can be very helpful to delete these if many changes are made; otherwise, extra files may continue to be present. 

#### Locally link files

### This App

In terminal, run; npm link

### Consuming App

In terminal, run: npm link @denjpeters/intelliwakereact
