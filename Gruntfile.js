module.exports = function(grunt) {

	// project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['dist'],
		copy: {
			main: {
				src: 'dashboard-gauge.js',
				dest: 'dist/'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'dashboard-gauge.js',
				dest: 'dist/dashboard-gague.min.js'
			}
		}
	})

	// load the plugins
	grunt.loadNpmTasks('grunt-contrib-clean')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-contrib-uglify')

	// default task
	grunt.registerTask('default', ['clean', 'uglify', 'copy'])
}