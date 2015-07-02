module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: {
                src: ['Gruntfile.js', 'js/*.js']
            },
            options: grunt.file.readJSON('.jshintrc')
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'js/*.js'],
                tasks: ['jshint']
            },
            styles: {
                files: ['less/*.less'],
                tasks: ['less']
            },
            livereload: {
                files: ['*.html', 'js/**', '!node_modules'],
                options: {
                    livereload: true
                }
            }
        },
        less: {
            all: {
                files: {
                    'css/main.css': 'less/project.less'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
};