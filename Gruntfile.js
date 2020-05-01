module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      development: {
        options: {
          paths: ["assets/www/css/less"]
        },
        files: {
          "assets/www/css/css/result.css": "assets/www/css/less/**/*.less"
        }
      }
    },
    jshint: {
      options: {
        globals: {
          jQuery: true
        },
      },
      uses_defaults: ['assets/www/js/**/*.js'],
      with_overrides: {
        options: {
          curly: false,
          undef: true,
        },
        files: {
          src: ['assets/www/js/*.js', 'assets/www/js/**/*.js',
            'assets/www/js/**/**/*.js'
          ]
        },
      }
    },
    comments: {
      js: {
        // Target-specific file lists and/or options go here.
        options: {
          singleline: true,
          multiline: true
        },
        src: ['assets/www/lib/*.js', 'assets/www/js/**/*.js',
          'assets/www/js/**/**/*.js'
        ]
      },
    },
    concat: {
      options: {
        separator: '/* Attaching new file */',
      },
      target: {
        files: {
          'assets/www/build/libraries.js': ['assets/www/lib/*.js'],
          'assets/www/build/build.js': ['assets/www/js/*.js',
            'assets/www/js/**/*.js', 'assets/www/js/**/**/*.js'
          ],
          'assets/www/build/build.css': ['assets/www/css/less/**/*.less',
            'assets/www/css/css/*.css'
          ]
        }
      }

    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery', 'angular', 'app']
        }
      },
      js: {
        files: {
          'assets/www/build/build.min.js': ['assets/www/build/build.js'],
          'assets/www/build/libraries.min.js': [
            'assets/www/build/libraries.js'
          ]
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'assets/www/build/build.min.css': ['assets/www/build/build.css']
        }
      }
    },
    express: {
      dev: {
        options: {
          script: 'server.js'
        }
      }
    },
    watch: {
      js: {
        files: ['assets/www/js/*.js', 'assets/www/js/**/*.js',
          'assets/www/js/**/**/*.js', 'assets/www/lib/*.js'
        ],
        tasks: ['comments', 'concat', 'jshint'], // avoided 'jshint'
      },
      scss: {
        files: ['assets/www/css/less/**/*.less'],
        tasks: ['less'],
      },
      css: {
        files: ['assets/www/css/css/*.css'],
        tasks: ['concat'],
      },
      uglify: {
        files: ['assets/www/build/build.js',
          'assets/www/build/libraries.js'
        ],
        tasks: ['uglify'],
      },
      cssmin: {
        files: ['assets/www/build/build.css'],
        tasks: ['cssmin'],
      }
    }
  });

  // Start all tasks
  grunt.registerTask('serve', ['less', 'comments', 'concat', 'uglify',
    'cssmin', 'express', 'watch'
  ]); // avoided 'jshint'

  //Loading NPM tasks
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-stripcomments');


  /*grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  */

};
