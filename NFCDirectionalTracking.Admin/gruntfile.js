module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            main: {
                src: ['script/src/*.ts', 'script/src/nfc/*.ts'],
                out: 'script/dist/app.js',
                options: {
                    target: 'es5'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', ['ts']);
};