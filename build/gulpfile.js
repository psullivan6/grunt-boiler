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
var jade         = require('gulp-jade');
var include      = require('gulp-file-include');
var sass         = require('gulp-sass');
var minify_css   = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var beeper       = require('beeper'); // creates a Terminal beep; TODO: assign to errors
var pagespeed    = require('psi');
var ngrok        = require('ngrok');
var browserSync  = require('browser-sync');
var runSequence  = require('run-sequence');
var express      = require('express');
var plumber      = require('gulp-plumber');
var changed      = require('gulp-changed');

var SITE = '';
var PORT = 8000;


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
    source: [ path.join(paths.bower, '/modernizr/modernizr.js') ],
    destination: path.join(paths.distribution, '/javascripts')
  },
  {
    name: 'scripts-footer',
    source: [
      path.join(paths.source, '/javascripts/*.js'),
      path.join(paths.source, '/javascripts/!(styleguide)/*.js')
    ],
    destination: path.join(paths.distribution, '/javascripts')
  },
  {
    name: 'styleguide',
    source: [ path.join(paths.source, '/javascripts/styleguide/*.js') ],
    destination: path.join(paths.distribution, '/javascripts')
  }
];

var stylePaths = [
  {
    name: 'styles',
    source: [
      path.join(paths.bower, '/normalize.css/normalize.css'),
      path.join(paths.source, '/stylesheets/styles.scss')
    ],
    destination: path.join(paths.distribution, '/stylesheets')
  },
  {
    name: 'styleguide',
    source: [
      path.join(paths.source, '/stylesheets/styleguide/styleguide.scss')
    ],
    destination: path.join(paths.distribution, '/stylesheets')
  }
];

var htmlPaths = [
  path.join(paths.source, '/templates/**/!(_)*.jade')
];


// #############################################################################
// Tasks
// #############################################################################

// =============================================================================
// Tasks > javascripts                                            $ gulp scripts
// =============================================================================
gulp.task('scripts', ['vendorScripts'], function(){
  var tasks = scriptPaths.map(function(files) {
    return gulp.src(files.source)
      .pipe(plumber())
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter(stylish))
      .pipe(jshint.reporter('fail'))
      .pipe(sourcemaps.init())
        .pipe(concat(files.name + '.js'))
        .pipe(minify_js())
        .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write())
      .pipe(plumber.stop())
      .pipe(gulp.dest(files.destination));
  });
  
  return merge(tasks);
});

// Move the already minified version of jQuery to the distribution directory
gulp.task('vendorScripts', function() {
  gulp.src(path.join(paths.bower, '/jquery/dist/jquery.min.js'))
    .pipe(changed(path.join(paths.distribution, '/javascripts/vendor')))
    .pipe(gulp.dest(path.join(paths.distribution, '/javascripts/vendor')))
});


// =============================================================================
// Tasks > Compile SCSS Styles                                     $ gulp styles
// =============================================================================
gulp.task('styles', function(){
  var tasks = stylePaths.map(function(files) {
    return gulp.src(files.source)
      .pipe(plumber())
      .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(concat(files.name + '.css'))
        .pipe(minify_css())
      .pipe(sourcemaps.write())
      .pipe(rename({suffix: '.min'}))
      .pipe(plumber.stop())
      .pipe(gulp.dest(files.destination));
  });
  
  return merge(tasks);
});

// =============================================================================
// Tasks > Compile HTML                                              $ gulp html
// =============================================================================
gulp.task('html', function() {
  gulp.src(htmlPaths)
    .pipe(plumber())
    .pipe(jade())
    .pipe(minify_html({
      comments: true,
      spare: true
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.distribution))
});

// =============================================================================
// Tasks > Clean Disribution Directory                              $ gulp clean
// =============================================================================
gulp.task('clean', function (callback) {
  
  del(path.join(paths.distribution, '/**'), { force: true }, callback);
});

// =============================================================================
// Tasks > Start a local server                                    $ gulp server
// =============================================================================
gulp.task('server', ['watch'], function(){
  var app = express();
  app.use(express.static(paths.distribution));
  app.listen(PORT);
});

// Sequence of PageSpeed related tasks
gulp.task('ngrok-server', function (callback) {
  return runSequence(
    'server',
    'ngrok',
    callback
  );
});

// =============================================================================
// Tasks > Watch files then run tasks                               $ gulp watch
// =============================================================================
gulp.task('watch', function() {
  // Watch script files
  gulp.watch(path.join(paths.source, '/javascripts/**/*.js'), ['scripts']);
  gulp.watch(path.join(paths.source, '/stylesheets/**/*.scss'), ['styles']);
  gulp.watch(path.join(paths.source, '/templates/**/!(_)*.jade'), ['html']);
});

// =============================================================================
// Tasks > Page Speed Insights                                      $ gulp speed
// =============================================================================
// ngrok public URL made from localhost:PORT
gulp.task('ngrok', function(callback) {
  return ngrok.connect(PORT, function (err, url) {
    SITE = url;
    console.log(url);
    callback();
  });
});

// PageSpeed Desktop
gulp.task('pagespeed-desktop', function (callback) {
  pagespeed.output(SITE, {
    key: 'AIzaSyBpQImDtbBpSVdkb0Hl5Qm4Ov5ipkWgqeU',
    strategy: 'desktop'
  }, callback);
});

// PageSpeed Mobile
gulp.task('pagespeed-mobile', function (callback) {
  pagespeed.output(SITE, {
    key: 'AIzaSyBpQImDtbBpSVdkb0Hl5Qm4Ov5ipkWgqeU',
    strategy: 'mobile'
  }, callback);
});

// Sequence of PageSpeed related tasks
gulp.task('pagespeed-sequence', function (callback) {
  return runSequence(
    'server',
    'ngrok',
    'pagespeed-desktop',
    'pagespeed-mobile',
    callback
  );
});

// Actual PageSpeed task that runs all the others
gulp.task('speed', ['pagespeed-sequence'], function(callback) {
  process.exit();
  return callback
});

// =============================================================================
// Tasks > Default task                                                   $ gulp
// =============================================================================
gulp.task('default', ['clean', 'html', 'styles', 'scripts']);

// =============================================================================
// Tasks > Build the site                                           $ gulp build
// =============================================================================
gulp.task('build', ['html', 'styles', 'scripts']);

module.exports = gulp;