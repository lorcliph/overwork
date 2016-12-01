/**
 * Created by shinyaohnuki on 2016/11/29.
 */
module.exports=function(grunt){
    grunt.initConfig({
        cacheBust: {
            taskName: {
                options: {
                    assets: ['js/*.js'],
                    baseDir: 'public/',
                    queryString: true
                },
                cwd: 'public/pages',
                src: ['*.html']
            }
        }
    });

    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.registerTask('default',['cacheBust']);

}