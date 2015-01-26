# gulp-boiler

Boilerplate code for [gulp](http://gulpjs.com/)


---

# Dependencies

## Tools / Software
*stuff you need to INSTALL before any of this will work*

**required** | **optional**
--| --
[Git](http://git-scm.com/) &hellip; duh, kinda | [EditorConfig](http://editorconfig.org/) and editor/IDE [plugin download](http://editorconfig.org/#download)
[Node](http://nodejs.org/), specifically [npm](https://docs.npmjs.com/getting-started/installing-node) |
[Bower](http://bower.io/#install-bower) |

## Plugins

### [Gulp Plugins](http://gulpjs.com/plugins/)

[`var gulp = require('gulp');`](http://gruntjs.com/getting-started#installing-grunt-and-gruntplugins)



[`"grunt-autoprefixer": "^2.1.0",`](https://www.npmjs.com/package/gulp-autoprefixer/)
[`"grunt-contrib-clean": "^0.6.0",`](https://www.npmjs.com/package/grunt-contrib-clean)
[`"grunt-contrib-copy": "^0.7.0",`](https://www.npmjs.com/package/grunt-contrib-copy)
[`"grunt-contrib-jshint": "^0.10.0",`](https://npmjs.org/package/grunt-contrib-jshint)
[`"grunt-contrib-sass": "^0.8.1",`](https://npmjs.org/package/grunt-contrib-sass)
[`"grunt-contrib-uglify": "^0.7.0",`](https://npmjs.org/package/grunt-contrib-uglify)
[`"grunt-contrib-watch": "^0.6.1",`](https://npmjs.org/package/grunt-contrib-watch)
[`"grunt-includes": "^0.4.5",`](https://npmjs.org/package/grunt-includes)
[`"jshint-stylish": "^1.0.0"`](https://github.com/sindresorhus/jshint-stylish)

### [Bower](http://bower.io/search/)
[`"modernizr": "~2.8.3"`](https://github.com/Modernizr/Modernizr)

---

# Namespacing

## Directories

### `/build`
The root-level build directory that houses all the important code that
eventually compiles into the finished site in the `/dist` directory

#### `/build/scripts`
The `/build` level directory that houses all javascripts,
coffeescripts, and other cupo'joescripts.

#### `/build/styles`
The `/build` level directory that houses all stylesheets, with
the preference being that they are SASS.

### `/dist`
The root-level 'dist' or 'distribution' directory that houses all the final
files. This directory can be pushed directly to a git remote, s3 bucket, or
whatever location is desired for final delivery to the user.

---


# Run Locally
***stuff you need to DO before any of this will work***

1. Navigate to the `/build` directory: `$: cd build/`
1. Install all the *node* package dependencies: `$: npm install`
1. Install all the *bower* package dependencies: `$: bower install`

## To-Dos

* add different branches for JADE, HTML, etc... versions
    * still worth setting some defaults like SASS instead of LESS, always
* add a new branch for squarepsace setup...use existing code and grunt-init if possible
* add includes section for the boilerplate code for the `<head>`
* add includes section for the boilerplate code for the footer scripts
* add as much html 5 boilerplate code as possible
* tag release when all of this stuff is pretty much done
* use `/build` and `/dist` for root-level directories

# Notes

- http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/
- Need to add a `clean` argument to the speed task to deliver just the page speed score and none of the rest of the data
- Need to add a `persist` parameter or something to the server workflow, so the
express server and ngrok keep running, this will allow for running PageSpeed on
the web, rather than w/ the terminal. It will also allow a local server, so duh
- Add in some sort of edit CSS in chrome dev tools and have it port back to the SCSS tool
