module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // -------------------------------------------------------------------------
    // Uglify
    // -------------------------------------------------------------------------
    uglify : {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      files: {
        '../<%= pkg.name %>/js/<%= pkg.name %>.min.js' : [
          './source/**/*.js',
          '!./source/includes/**/*.js'
        ]
      }
    },
    
    // -------------------------------------------------------------------------
    // JS Hint
    // -------------------------------------------------------------------------
    jshint: {
      options: {
        jshintrc: ".jshintrc",
        reporter: require('jshint-stylish')
      },
      init: [
        './Gruntfile.js',
        './source/**/*.js'
      ]
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
  grunt.registerTask('default', ['jshint']);

};