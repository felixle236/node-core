module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist'],
        sync: {
            main: {
                files: [{
                    cwd: 'src',
                    src: ['**/*', '!**/*.ts'],
                    dest: 'dist'
                }],
                verbose: false, // Default: false
                pretend: false, // Don't do any disk operations - just write log. Default: false
                failOnError: true, // Fail the task when copying is not possible. Default: false
                // ignoreInDest: [
                //     '**/*.js'
                // ], // Never remove js files from destination. Default: none
                updateAndDelete: false, // Remove all files from dist that are not found in src. Default: false
                compareUsing: 'md5' // compares via md5 hash of file contents, instead of file modification time. Default: "mtime"
            }
        }
    });
};
