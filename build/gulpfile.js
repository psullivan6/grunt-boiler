'use strict'

// #############################################################################
// Plugins
// #############################################################################
var gulp         = require('gulp');
var path         = require('path');
var minify_js    = require('gulp-uglify');
var jshint       = require('gulp-jshint');
var stylish      = require('jshint-stylish');
var concat       = require('gulp-concat');
var rename       = require('gulp-rename');
var sourcemaps   = require('gulp-sourcemaps');
var del          = require('del');
var merge        = require('gulp-sequence');
var gulpif       = require('gulp-if');
var minify_html  = require('gulp-minify-html');
var include      = require('gulp-file-include');
var sass         = require('gulp-sass');
var minify_css   = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var beeper       = require('beeper'); // creates a Terminal beep; TODO: assign to errors
var pagespeed    = require('psi');
var ngrok        = require('ngrok');
var browserSync  = require('browser-sync');
var runSequence  = require('run-sequence');
var h5bp         = require('h5bp');

var site = '';


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
  path.join(paths.source, '/templates/**/!(_)*.html')
];

var stylePaths = [
  path.join(paths.source, '/stylesheets/**/*.scss')
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
        .pipe(minify_js())
        .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(files.destination));
  });
  
   return merge(tasks);
});


// =============================================================================
// Tasks > Compile SCSS Styles                                     $ gulp styles
// =============================================================================
gulp.task('styles', function () {
  gulp.src(stylePaths)
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer('last 2 versions'))
      .pipe(minify_css())
    .pipe(sourcemaps.write())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.join(paths.distribution, '/stylesheets')));
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
    .pipe(minify_html(options))
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
// Tasks > Page Speed Insights                                      $ gulp speed
// =============================================================================
gulp.task('ngrok-url', function(callback) {
  return ngrok.connect(8000, function (err, url) {
    site = url;
    callback();
  });
});

gulp.task('pagespeed-desktop', function (callback) {
  pagespeed.output(site, {
    nokey: 'true',
    strategy: 'desktop'
  }, callback);
});

gulp.task('pagespeed-mobile', function (callback) {
  pagespeed.output(site, {
    nokey: 'true',
    strategy: 'mobile'
  }, callback);
});

gulp.task('pagespeed-sequence', function (callback) {
  return runSequence(
    'server',
    'ngrok-url',
    'pagespeed-desktop',
    'pagespeed-mobile',
    callback
  );
});

gulp.task('speed', ['pagespeed-sequence'], function(callback) {
  console.log('Woohoo! Check out your page speed scores!')
  process.exit();
  return callback
})


gulp.task('server', function(){
  var app = h5bp.createServer({ root: paths.distribution });
  app.listen(8000);
})

// =============================================================================
// Tasks > Default                                                        $ gulp
// =============================================================================
gulp.task('default', ['clean', 'html', 'scripts']);
