module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    "babel": {
      options: {
        sourceMap: false
      },
      dist: {
        expand: true,
        cwd: "src/",
        src: ["**/*.js"],
        dest: "dist/"
      }
    }
  });

  grunt.registerTask("default", ["babel"]);

};
