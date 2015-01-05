module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // -------------------------------------------------------------------------
    // Clean 'dist'ribution directory
    // -------------------------------------------------------------------------
    clean: {
      options: {
        force: true
      },
      files: ['../dist']
    },
    
    // #########################################################################
    // Javascript Processing
    // #########################################################################
    
    // -------------------------------------------------------------------------
    // Javascript Processing > JS Hint
    // -------------------------------------------------------------------------
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      init: [
        './Gruntfile.js',
        './_source/**/*.js'
      ]
    },
    
    // -------------------------------------------------------------------------
    // Javascript Processing > Uglify/Minify JS Files
    // ----
    // Build directory: /build/scripts
    // Dist directory: /dist/js
    // -------------------------------------------------------------------------
    uglify: {
      options: {
        _sourceMap: true,
        _sourceMapName: './<%= pkg.name %>/js/scripts.map'
      },
      build: {
        files: {
          '../dist/js/scripts.min.js': [
            './_source/**/*.js',
            '!./_source/includes/**/*.js'
          ],
          '../dist/js/modernizr.min.js': [
            './bower_components/modernizr/modernizr.js'
          ]
        }
      }
    },
    
    // -------------------------------------------------------------------------
    // SASS
    // -------------------------------------------------------------------------
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'styles',
          src: ['*.scss'],
          dest: '../public',
          ext: '.css'
        }]
      }
    }
  });
  
  // ###########################################################################
  // Tasks
  // ###########################################################################
  
  // ---------------------------------------------------------------------------
  // Tasks > Load Plugins
  // ---------------------------------------------------------------------------
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // JS
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // MOVE + CLEAN
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  // CSS
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  
  // INCLUDES
  grunt.loadNpmTasks('grunt-includes');
  
  
  // ---------------------------------------------------------------------------
  // Tasks > Tasks to Run
  // ---------------------------------------------------------------------------
  grunt.registerTask('default', ['clean', 'jshint', 'uglify']);

};
