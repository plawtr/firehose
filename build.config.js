/**
 * This file/module contains all configuration for the build process.
 */
module.exports = function (grunt) {

    return {
        /**
         * The `build_dir` folder is where our projects are compiled during
         * development and the `compile_dir` folder is where our app resides once it's
         * completely built.
         */
        build_dir: 'server/build', /** development **/
        compile_dir: 'bin', /** production **/
        temp_dir: 'temp', /** temp folder **/

        /**
         * This is a collection of file patterns that refer to our app code (the
         * stuff in `src/`). These file paths are used in the configuration of
         * build tasks. `js` is all project javascript, less tests. `ctpl` contains
         * our reusable components' (`src/common`) template HTML files, while
         * `atpl` contains the same, but for our app's code. `html` is just our
         * main HTML file, `less` is our main stylesheet, and `unit` contains our
         * app's unit tests.
         */
        app_files: {
            js: sortJsFilesFromPathsPatterns([
                'src/common/privateApi.js',
                'src/watson/**/*.js',
                'src/common/**/*.js',
                'src/app/**/*.js',
                '!src/**/*.spec.js'
            ]),
            jsunit: [
                'test/utils/matchers/**/*.js',
                'test/utils/test-utils.js',
                'test/utils/mocks/**/*.js',
                'src/**/*.spec.js'
            ],

            atpl: [ 'src/app/**/*.tpl.html' ],
            ctpl: [ 'src/common/**/*.tpl.html' ],

            html: [],
            less: ['src/common/less/**/*.less', 'src/common/components/**/*.less', 'src/app/**/*.less'],
            fonts: [
                'src/app/shared/less/fonts/**/*.eot',
                'src/app/shared/less/fonts/**/*.svg',
                'src/app/shared/less/fonts/**/*.ttf',
                'src/app/shared/less/fonts/**/*.woff'
            ]
        },

        /**
         * These are the files that must be included into the portlet war
         * and they will be minified.
         */
        vendor_files: {
            js: [
                'vendor/angular/angular.js',
                'vendor/angular-ui-router/release/angular-ui-router.js'
            ],
            css: [
                'vendor/font-awesome/css/font-awesome.min.css',
                'vendor/bootstrap/dist/css/bootstrap.css'
            ],
            fonts: [
                'vendor/font-awesome/fonts/*'
            ],
            assets: [

            ]
        }
    };

    //****** Local functions *****

    /**
     * This method sorts all the passed patterns array adding first the script whose name is the same as the container folder.
     * The order of the passed array items is maintained and we only sort the expanded patterns.
     * ed and
     * @param filesGlobArray
     * @returns {Array} With all the sorted files.
     */

    function sortJsFilesFromPathsPatterns(filesGlobArray) {
        var sortedFiles = [];
        filesGlobArray.forEach(function (filesPattern) {
            if (filesPattern.indexOf('!') == 0) {
                sortedFiles.push(filesPattern);
            } else {
                var files = sortJsFiles(grunt.file.expand(filesPattern));
                sortedFiles.push.apply(sortedFiles, files);
            }
        });

        return grunt.file.expand(sortedFiles);
    }

    function sortJsFiles(files) {
        var tree = convertIntoTreeStructure(files);
        return treeToSortedFiles(tree);

        //***** Local functions *****
        function convertIntoTreeStructure(files) {
            var treeRoot = {};
            files.forEach(function (path) {
                var parts = path.split("/");
                addTreeDataStructure(treeRoot, parts);
            });

            return treeRoot;
            //**** Local functions ****

            function addTreeDataStructure(root, parts) {
                var name = parts[0];

                if (parts.length === 1) {
                    name = name.replace('.js', '');
                    root[name] = parts[0];
                } else {
                    if (!root[name]) {
                        root[name] = {};
                    }
                    addTreeDataStructure(root[name], parts.slice(1));
                }
            }
        }

        function treeToSortedFiles(root, rootName, files, prefix) {
            var prop,
                nodeFiles = [];

            prefix = prefix || '';
            files = files || [];

            for (prop in root) {
                if (root.hasOwnProperty(prop) && typeof root[prop] === "string") {
                    if (prop === rootName) {
                        nodeFiles.unshift(prefix + root[prop]);
                    } else {
                        nodeFiles.push(prefix + root[prop]);
                    }
                }
            }

            for (prop in root) {
                if (root.hasOwnProperty(prop) && typeof root[prop] === "object") {
                    treeToSortedFiles(root[prop], prop, nodeFiles, prefix === '' ? prop + '/' : prefix + prop + '/');
                }
            }

            files.push.apply(files, nodeFiles);
            return files;
        }
    }

};


