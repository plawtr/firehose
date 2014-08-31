/**
 * This grunt file will build and compile all the frontend related pages
 * and prepare for the ugilfy method.
 *
 * @author jopi
 * @type {*}
 *
 */

var path = require('path');

module.exports = function (grunt) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-shell-spawn');

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */

    var userConfig = require('./build.config.js')(grunt);

    var taskConfig = {

        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON('package.json'),

        /**
         * The banner is the comment that is placed at the top of our compiled
         * source files. It is first processed as a Grunt template, where the `<%=`
         * pairs are evaluated based on this very configuration object.
         */
        meta: {
            banner: '/**\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
                ' */\n'
        },

        /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: {
            options: {
                // 'no-write': true,
                'force': true
            },
            tempDirs: [
                '<%= temp_dir %>',
                '<%= build_dir %>',
                '<%= compile_dir %>'
            ]
        },

        copy: {
            build_assets: {
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= build_dir %>/assets/',
                        cwd: 'src/assets',
                        expand: true
                    }
                ]
            },
            build_html: {
                files: [
                    {
                        src: ['<%= app_files.html %>'],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_js: {
                files: [
                    {
                        src: [ '<%= app_files.js %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_fonts: {
                files: [
                    {
                        src: [ '<%= app_files.fonts %>' ],
                        dest: '<%= build_dir %>/fonts/',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            build_vendor_js: {
                files: [
                    {
                        src: [ '<%= vendor_files.js %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_vendor_assets: {
                files: [
                    {
                        src: [ '<%= vendor_files.assets %>' ],
                        dest: '<%= build_dir %>/assets/',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            build_vendor_fonts: {
                files: [
                    {
                        src: [ '<%= vendor_files.fonts %>' ],
                        dest: '<%= build_dir %>/fonts/',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            build_html2Js: {
                files: [
                    {
                        src: [ '<%= html2js.app.dest %>', '<%= html2js.common.dest %>' ],
                        dest: '<%= build_dir %>',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            compile_html: {
                files: [
                    {
                        src: '<%= app_files.html %>',
                        dest: '<%= compile_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            compile_assets: {
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= compile_dir %>/assets/',
                        cwd: '<%= build_dir %>/assets/',
                        expand: true
                    }
                ]
            },
            compile_fonts: {
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= compile_dir %>/fonts',
                        cwd: '<%= build_dir %>/fonts',
                        expand: true
                    }
                ]
            }
        },

        /**
         * `recess` handles our LESS compilation and uglification automatically.
         * Only our `main.less` file is included in compilation; all other files
         * must be imported from this file.
         */
        recess: {
            build: {
                options: {
                    compile: true,
                    compress: false,
                    noUnderscores: false,
                    noIDs: false,
                    zeroUnits: false
                },
                files: {
                    '<%= build_dir %>/css/<%= pkg.name %>-<%= pkg.version %>.css': ['<%= vendor_files.css %>', '<%= filesTemplate.mainLess.dest %>']
                }
            },
            compile: {
                options: {
                    compile: true,
                    compress: true,
                    noUnderscores: false,
                    noIDs: false,
                    zeroUnits: false
                },
                files: {
                    '<%= compile_dir %>/css/<%= pkg.name %>-<%= pkg.version %>.css': ['<%= vendor_files.css %>', '<%= filesTemplate.mainLess.dest %>']
                }
            }
        },

        /**
         * HTML2JS is a Grunt plugin that takes all of your template files and
         * places them into JavaScript files as strings that are added to
         * AngularJS's template cache. This means that the templates too become
         * part of the initial payload as one JavaScript file. Neat!
         */
        html2js: {
            /**
             * These are the templates from `src/app`.
             */
            app: {
                src: [ '<%= app_files.atpl %>' ],
                dest: '<%= temp_dir %>/templates-app.js'
            },

            /**
             * These are the templates from `src/common`.
             */
            common: {
                src: [ '<%= app_files.ctpl %>' ],
                dest: '<%= temp_dir %>/templates-common.js'
            }
        },

        /**
         * `grunt concat` concatenates multiple source files into a single file.
         */
        concat: {
            /**
             * The `compile_js` target is the concatenation of our application source
             * code and all specified vendor source code into a single file.
             */
            compile_js: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: [
                    '<%= vendor_files.js %>',
                    '<%= html2js.app.dest %>',
                    '<%= html2js.common.dest %>',
                    'module.prefix',
                    '<%= app_files.js %>',
                    'module.suffix'
                ],
                dest: '<%= compile_dir %>/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        /**
         * Minify the sources!
         */
        uglify: {
            options: {
                banner: '<%= meta.banner %>',
                mangle: false
            },
            compile_js: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    '<%= concat.compile_js.dest %>': ['<%= concat.compile_js.dest %>']
                }
            }
        },

        /**
         * This task compiles the files template so that changes to its file array
         * don't have to be managed manually.
         */
        filesTemplate: {
            jsFilesLoader: {
                files: [
                    '<%= vendor_files.js %>',
                    '<%= html2js.app.dest %>',
                    '<%= html2js.common.dest %>',
                    '<%= app_files.js %>'
                ],
                transformFile: replacePrefix.bind(null, ['<%= build_dir %>/', '<%= temp_dir %>/'], ''),
                src: 'tpls/jsFilesLoader.tpl.js',
                dest: '<%= build_dir %>/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            mainLess: {
                files: [
                    '<%= app_files.less %>'
                ],
                src: 'tpls/main.tpl.less',
                dest: '<%= temp_dir %>/main.less'
            },
            dev_index: {
                files: [
                    '<%= filesTemplate.jsFilesLoader.files %>',
                    '<%= build_dir %>/css/<%= pkg.name %>-<%= pkg.version %>.css'
                ],
                transformFile: replacePrefix.bind(null, ['<%= build_dir %>/', '<%= temp_dir %>/'], ''),
                src: 'tpls/index.tpl.html',
                dest: '<%= build_dir %>/index.html'
            },
            prod_index: {
                files: [
                    '<%= concat.compile_js.dest %>',
                    '<%= compile_dir %>/css/<%= pkg.name %>-<%= pkg.version %>.css'
                ],
                transformFile: replacePrefix.bind(null, ['<%= compile_dir %>/'], ''),
                src: 'tpls/index.tpl.html',
                dest: '<%= compile_dir %>/index.html'
            }
        },

        shell: {
            startServer: {
                options: {
                    async: true
                },
                command: 'node server/server.js'
            }
        },

        /**
         * And for rapid development, we have a watch set up that checks to see if
         * any of the files listed below change, and then to execute the listed
         * tasks when they do. This just saves us from having to type "grunt" into
         * the command-line every time we want to see what we're working on; we can
         * instead just leave "grunt watch" running in a background terminal. Set it
         * and forget it.
         *
         * But we don't need the same thing to happen for all the files.
         */
        delta: {
            /**
             * By default, we want the Live Reload to work for all tasks; this is
             * overridden in some tasks (like this file) where browser resources are
             * unaffected. It runs by default on port 35729, which your browser
             * plugin should auto-detect.
             */
            options: {
                livereload: 35729
            },

            /**
             * When our JavaScript source files change, we want to run copy them and
             * run our unit tests.
             */
            jssrc: {
                files: [
                    '<%= app_files.js %>'
                ],
                tasks: ['copy:build_js']
            },

            /**
             * When assets are changed, copy them. Note that this will *not* copy new
             * files, so this is probably not very useful.
             */
            assets: {
                files: [
                    'src/assets/**/*'
                ],
                tasks: [ 'copy:build_assets' ]
            },

            /**
             * When our templates change, we only rewrite the template cache.
             */
            tpls: {
                files: [
                    '<%= app_files.atpl %>',
                    '<%= app_files.ctpl %>'
                ],
                tasks: [ 'html2js', 'copy:build_html2Js' ]
            },

            /**
             * When the CSS files change, we need to compile and minify them.
             */
            less: {
                files: [ '<%= app_files.less %>' ],
                tasks: [ 'recess:build' ]
            }
        }

    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    grunt.registerTask('default', [ 'compile']);

    /**
     * In order to make it safe to just compile or copy *only* what was changed,
     * we need to ensure we are starting from a clean, fresh build. So we rename
     * the `watch` task to `delta` (that's why the configuration var above is
     * `delta`) and then add a new task called `watch` that does a clean build
     * before watching for changes.
     */
    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', [ 'build', 'delta' ]);

    /**
     * The `build` task gets your app ready for development. BUILD TASK
     */
    grunt.registerTask('build', [
        'clean',
        'html2js',
        'copy:build_html2Js',
        'copy:build_js',
        'copy:build_vendor_js',
        'copy:build_assets',
        'copy:build_fonts',
        'copy:build_vendor_assets',
        'copy:build_vendor_fonts',
        'filesTemplate:jsFilesLoader',
        'filesTemplate:mainLess',
        'recess:build',
        'filesTemplate:dev_index'
    ]);

    /**
     * The `compile` task gets your app ready for deployment by concatenating and
     * minifying your code. COMPILE TASK
     */
    grunt.registerTask('compile', [
        'build',
        'filesTemplate:prod_index',
        'copy:compile_assets',
        'copy:compile_fonts',
        'concat:compile_js',
        'uglify:compile_js',
        'recess:compile'
    ]);

    grunt.registerTask('start-dev', [
        'shell:startServer',
        'watch'
    ]);


    grunt.registerTask('start-prod', [
        'compile',
        'shell:startServer'
    ]);

    /**
     *  In order to avoid having to specify manually the files needed for a file
     * (i.e. a main.less or a files loader) we use grunt to manage
     *  the list of files for us. Yay!
     */
    grunt.registerMultiTask('filesTemplate', 'Process a file templates that needs to dynamically add an array of files', function () {
        function identity(val) {
            return val;
        }

        function transformFiles(files, transform) {
            var transformedFiles = [];
            files.forEach(function (file) {
                transformedFiles.push(transform(file));
            });
            return transformedFiles;
        }

        var data = this.data,
            transformFile = data.transformFile || identity,
            files = transformFiles(grunt.file.expand(data.files), transformFile),
            srcTemplate = data.src,
            destFile = data.dest;


        //noinspection JSUnusedLocalSymbols
        grunt.file.copy(srcTemplate, destFile, {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        files: files,
                        scripts: filterForJS(files),
                        styles: filterForCSS(files)
                    }
                });
            }
        });
    });

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
        return files.filter(function (file) {
            return file.match(/\.js$/);
        });
    }

    /**
     * A utility function to get all app CSS sources.
     */
    function filterForCSS(files) {
        return files.filter(function (file) {
            return file.match(/\.css$/);
        });
    }

    function replacePrefix(prefixes, newPrefix, str) {
        prefixes = Array.isArray(prefixes) ? prefixes : [prefixes];
        prefixes.forEach(function (prefix) {
            prefix = grunt.template.process(prefix);
            str = str.replace(prefix, '')
        });
        newPrefix = grunt.template.process(newPrefix);
        return newPrefix + str;
    }
};



