'use strict'

// #############################################################################
// Plugins
// #############################################################################
var gulp        = require('gulp');
var path        = require('path');
var uglify      = require('gulp-uglify');
var jshint      = require('gulp-jshint');
var stylish     = require('jshint-stylish');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var del         = require('del');
var merge       = require('gulp-sequence');
var gulpif      = require('gulp-if');
var uglify_html = require('gulp-minify-html');
var include     = require('gulp-file-include');


// #############################################################################
// Directory + File Paths
// #############################################################################
var paths = {
  source: '_source',
  bower: 'bower_components',
  distribution: '../dist'
};

var scriptPaths = [
  {
    name: 'scripts-header',
    hint: false,
    source: [
      path.join(paths.bower, 'modernizr/modernizr.js')
    ],
    destination: path.join(paths.distribution, '/javascripts')
  },
  {
    name: 'scripts-footer',
    hint: true,
    source: [
      path.join(paths.source, '/javascripts/**/*.js')
    ],
    destination: path.join(paths.distribution, '/javascripts')
  }
];

var htmlPaths = [
  path.join(paths.source, '/markup/**/!(_)*.html')
];


// #############################################################################
// Tasks
// #############################################################################

// =============================================================================
// Tasks > javascripts                                            $ gulp scripts
// -----------------------------
// SUMMARY: Run each set of files from the `scriptPaths` array and conditionally
// check them for errors, sylish-ly displaying those errors if they exist. If no
// errors then sourcemap the files, combine them into one file, minify that
// file, and then move it to the destination directory from `scriptPaths`.
// =============================================================================
gulp.task('scripts', function(){
  var tasks = scriptPaths.map(function(files) {
    return gulp.src(files.source)
      .pipe(gulpif(files.hint, jshint('.jshintrc')))
      .pipe(gulpif(files.hint, jshint.reporter(stylish)))
      .pipe(gulpif(files.hint, jshint.reporter('fail')))
      .pipe(sourcemaps.init())
        .pipe(concat(files.name + '.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(files.destination));
  });
  
   return merge(tasks);
});

// =============================================================================
// Tasks > Compile HTML                                              $ gulp html
// =============================================================================
gulp.task('html', function() {
  var options = {
    comments: true,
    spare: true
  };
  
  gulp.src(htmlPaths)
    .pipe(include({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(uglify_html(options))
    .pipe(gulp.dest(paths.distribution))
});

// =============================================================================
// Tasks > Clean Disribution Directory                              $ gulp clean
// =============================================================================
gulp.task('clean', function(callback) {
  var options = {
    force: true
  };
  
  del([paths.distribution], options, callback);
});

// =============================================================================
// Tasks > Default                                                        $ gulp
// =============================================================================
gulp.task('default', ['clean', 'html', 'scripts']);
