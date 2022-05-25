module.exports = function(grunt) {
  require('google-closure-compiler').grunt(grunt, {
    platform: ['native', 'java', 'javascript'],
    max_parallel_compilations: require('os').cpus().length
  });

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Google closure compiler (javascript checker and optimizer)
    'closure-compiler': {
      target: {
        files: {
          'dist/scripts/main.min.js': ['src/scripts/**/*.js']
        },
        options: {
          compilation_level: 'SIMPLE',
          language_in: 'ECMASCRIPT5_STRICT',
          create_source_map: 'dist/scripts/main.min.js.map',
          output_wrapper: '(function(){\n%output%\n}).call(this)\n//# sourceMappingURL=main.min.js.map'
        }
      }
    },

    // PostCSS - Tailwindcss and Autoprefixer
    postcss: {
      options: {
        map: true, // inline sourcemaps
        processors: [
          require('tailwindcss')()
        ]
      },
      dist: {
        expand: true,
        cwd: 'src/styles/',
        src: ['**/*.css'],
        dest: 'dist/styles/',
        ext: '.css'
      }
    },

    // HTML minifier
    htmlmin: {                                     
      dist: {                                      
        options: {                                 
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: ['*.html'],
          dest: 'dist'
        }]
      }
    },

    // CSS minifier
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist/styles',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/styles',
          ext: '.min.css'
        }]
      }
    },

    // Watch for changes and run Tasks
    watch: {
      'closure-compiler': {
        files: 'src/scripts/**/*.css',
        tasks: ['compile-javascript'],
        options: {
          interrupt: true
        }
      },

      postcss: {
        files: 'src/styles/**/*.css',
        tasks: ['compile-tailwindcss'],
        options: {
          interrupt: true
        }
      }, 

      all: {
        files: 'src/**/*.*',
        tasks: ['compile-all'],
        options: {
          interrupt: true
        }
      }
    }
  });

  // Load Grunt Plugins
  require('load-grunt-tasks')(grunt);

  // Register Custom Tasks
  grunt.registerTask('rename-file-sources', 
    'Rename all file sources inside html file to production based one',
    function() {
      grunt.file.expandMapping('dist/*.html', '').forEach(mapping => {
        let src = grunt.file.read(mapping.src[0])

        try {
          let head = src.match(/<head>(.*)(?=<\/head>)/g)[0]
          let top = src.match(/(.*)(?=<head>)/g)[0]
          let bottom = src.match(/(?=<\/head>)(.*)/g)[0]

          // Rename css source inside link tag
          var regex = new RegExp(`<link href=\\"(.*)\\.css\\" rel=\\"stylesheet\\">`, 'g')
          head = head.replace(regex, `<link href="$1.min.css" rel="stylesheet">`);

          // Rename js source inside script tag
          var regex = new RegExp(`<script src=\\"(.*)\\.js\\" defer="defer"></script>`, 'g')
          head = head.replace(regex, `<script src="$1.min.js" defer="defer"></script>`);
          
          grunt.file.write(mapping.dest, `${top}${head}${bottom}`)
          grunt.log.ok(`File ${mapping.dest} successfully written`)
        } catch (error) {
          grunt.log.error(`File ${mapping.dest} error (${error})`) 
        }
      });
    }
  )

  // Register Tasks
  grunt.registerTask('compile-javascript', ['closure-compiler'])
  grunt.registerTask('compile-tailwindcss', ['postcss'])
  grunt.registerTask('compile-all', ['postcss', 'closure-compiler'])
  grunt.registerTask('compile-production', ['postcss', 'closure-compiler', 'htmlmin', 'cssmin', 'rename-file-sources'])

  // Register Watcher Tasks
  grunt.registerTask('watch-javascript', ['watch:closure-compiler'])
  grunt.registerTask('watch-tailwindcss', ['watch:postcss'])
  grunt.registerTask('watch-all', ['watch:all'])

  // Register Default Tasks
  grunt.registerTask('default', ['watch-all']);
}