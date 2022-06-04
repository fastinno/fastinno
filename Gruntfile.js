const path = require('path');

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
          require('tailwindcss')(),
          require('autoprefixer')()
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

    // Copy scripts source file
    copy: {
      main: {
        expand: true,
        cwd: 'src/scripts',
        src: '**',
        dest: 'dist/scripts/',
      },

      assets: {
        expand: true,
        cwd: 'src/assets',
        src: '**',
        dest: 'dist/assets/',
      },
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
          cwd: 'dist',
          src: ['**/*.html'],
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
    'Rename all file sources inside html files to production based one',
    function() {
      grunt.file.expandMapping('dist/**/*.html', '').forEach(mapping => {
        let src = grunt.file.read(mapping.src[0])

        try {
          let head = src.match(/<head>(.*)(?=<\/head>)/g)[0]
          let top = src.match(/(.*)(?=<head>)/g)[0]
          let bottom = src.match(/(?=<\/head>)(.*)/g)[0]

          // Rename css source inside link tag
          var regex = new RegExp(`<link href=\\"/dist(.*)\\.css\\" rel=\\"stylesheet\\">`, 'g')
          head = head.replace(regex, `<link href="$1.min.css" rel="stylesheet">`);

          // Rename js source inside script tag with defer mode
          var regex = new RegExp(`<script src=\\"/dist(.*)\\.js\\" defer="defer"></script>`, 'g')
          head = head.replace(regex, `<script src="$1.min.js" defer="defer"></script>`);

          // Rename js source inside script tag without defer mode
          var regex = new RegExp(`<script src=\\"/dist(.*)\\.js\\"></script>`, 'g')
          head = head.replace(regex, `<script src="$1.min.js"></script>`);
          
          grunt.file.write(mapping.dest, `${top}${head}${bottom}`)
          grunt.log.ok(`File ${mapping.dest} successfully written`)
        } catch (error) {
          grunt.log.error(`File ${mapping.dest} error (${error})`) 
        }
      });
    }
  )
  
  grunt.registerTask('modify-htmls', 
    'Modify all html files to production based one',
    function() {
      grunt.file.expandMapping('src/**/*.html', 'dist/', {
        rename: function(dest, matchedSrcPath, _) {
          return path.join(dest, matchedSrcPath.replace(/^src\//g, ''))
        }
      }).forEach(mapping => {
        let src = grunt.file.read(mapping.src[0])

        try {
          // Remove "/src" from `x-bind:href` to generate correct absolute link
          var regex = new RegExp(`x-bind:href=\\"\\'/src(.*)\\' \\+ (.+)\\"`, 'g')
          src = src.replace(regex, `x-bind:href="'$1' + $2"`);

          // Remove "/src" from `href` to generate correct absolute link
          var regex = new RegExp(`href=\\"/src(.*)\\"`, 'g')
          src = src.replace(regex, `href="$1"`);

          // Remove "/src" from `src` to generate correct absolute link
          var regex = new RegExp(`src=\\"/src(.*)\\"`, 'g')
          src = src.replace(regex, `src="$1"`);

          grunt.file.write(mapping.dest, `${src}`)
          grunt.log.ok(`File ${mapping.dest} successfully modified`)
        } catch (error) {
          grunt.log.error(`File ${mapping.dest} error (${error})`) 
        }
      });
    }
  )

  // Register Tasks
  grunt.registerTask('compile-javascript', ['closure-compiler'])
  grunt.registerTask('compile-tailwindcss', ['postcss'])
  grunt.registerTask('compile-all', ['copy', 'postcss', 'closure-compiler'])
  grunt.registerTask('compile-production', ['compile-all', 'modify-htmls', 'htmlmin', 'cssmin', 'rename-file-sources'])

  // Register Watcher Tasks
  grunt.registerTask('watch-javascript', ['watch:closure-compiler'])
  grunt.registerTask('watch-tailwindcss', ['watch:postcss'])
  grunt.registerTask('watch-all', ['watch:all'])

  // Register Default Tasks
  grunt.registerTask('default', ['compile-all', 'watch-all']);
}