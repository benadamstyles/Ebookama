module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    "babel": {
      options: {
        sourceMap: false
      },
      dist: {
        // 'index.js': 'src/index.js'
        expand: true,
        cwd: "src/",
        src: ["*.js"],
        dest: ""
      }
    }
  });

  grunt.registerTask("default", ["babel"]);

};
