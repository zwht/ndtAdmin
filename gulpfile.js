var path            = require('path');

var gulp            = require('gulp');
var del             = require("del");//删除文件
var browserSync     = require("browser-sync").create();//设置代理
var watchify        = require('gulp-watchify');//watchify 加速 browserify 编译
var plumber         = require("gulp-plumber");
var streamify       = require('gulp-streamify');
var buffer          = require('gulp-buffer');
var sourcemaps      = require("gulp-sourcemaps");//js文件生成.map文件，调试定位到源码
var uglify          = require("gulp-uglify");//js代码压缩
var seq             = require("gulp-sequence");
var proxyMiddleware = require('http-proxy-middleware');
var cached          = require("gulp-cached");
var jade            = require("gulp-jade");//编译jade为html
var less            = require("gulp-less");//编译less为css
var prefixer        = require("gulp-autoprefixer");
var fontcss         = require("gulp-iconfont-css");
var iconfont        = require("gulp-iconfont");
var usemin          = require('gulp-usemin');// 合并libs引入的文件
var rev             = require('gulp-rev');
var rename          = require("gulp-rename");//改文件名
var replace         = require("gulp-replace");//替换流字符
var babelify        = require("babelify");
var collapse        = require('bundle-collapser/plugin');   //reduce module path string;
var gulpif          = require("gulp-if");
var fe              = require("gulp-foreach");


var TYPE            = "DEV";
var DEPLOY_BUILD    = "../webRoot";
var FOLDER          = "tmp/";
var ENTRIES         = ["src/apps/entries/*.js"];
var CSSMAIN         = ["src/assets/style/style.less"];
var CSSDIR          = ["src/assets/style/**/*.less"];
var JADES           = ["src/views/**/*.jade"];
var IMAGES          = ["src/assets/images/**/*"];
var FONT            = ["src/assets/fonts/**/*"];
var ICONS           = ["src/assets/icon/**/*.svg"];

var SERVER_PORT     = 8088;

//连接后端接口地址
var SERVER_PROXY    = "http://192.168.49.3:9696";
//SERVER_PROXY      = "http://127.0.0.1:9000";
SERVER_PROXY      = "http://192.168.111.32:9000";
SERVER_PROXY      = "http://192.168.101.32:9001";

var config = {
    watch: true,
    cache: {},
    packageCache: {},
    setup: function (bundle) {
        bundle.transform('bulkify');
    }
};
//代理配置
var proxy = proxyMiddleware("/ms", {
    target: SERVER_PROXY,
    changeOrigin: true
});

var COLORS = {
    default: "./themes/default",
    theme1: "./themes/theme1",
    theme2: "./themes/theme2",
    theme3: "./themes/theme3",
    theme4: "./themes/theme4",
    theme5: "./themes/theme5"
};


//删除tmp目录文件
gulp.task("clear", function (cb) {
    del([FOLDER], cb);
});


//把所有需要用到的js用cmd规范打包为一个js，配置在src/enter目录内部
gulp.task("bundle", watchify(function (wf) {
    return gulp.src(ENTRIES)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(plumber())
        .pipe(wf(config))
        .on("error", function (error) {
            console.dir(error);
            this.emit('close');
            this.emit('end');
        })
        .pipe(streamify(plumber())) //fixed browserify update too early.
        .pipe(buffer())
        .pipe(gulpif(TYPE == "DEPLOY", uglify()))
        .on('error', function (error) {
            console.dir(error);
            this.emit('end');
        })
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(FOLDER + "js"));
}));
gulp.task("compile-lib", function () {
    return gulp.src(["lib/**/*"])
        .pipe(gulp.dest(FOLDER + "lib"));
});
gulp.task("compile-libs", function () {
    return gulp.src(["libs/**/*"])
        .pipe(gulp.dest(FOLDER + "libs"));
});
gulp.task("compile-jade", function () {
    var config = (TYPE == 'DEPLOY') ? {time: ""} : {time: "?v=" + new Date().getTime()};
    config.type = TYPE;
    return gulp.src(JADES)
        .pipe(cached("debug", {optimizeMemory: true}))
        .pipe(jade({locals: config}))
        .on("error", function (error) {
            console.dir(error);
            this.emit('end');
        })
        .pipe(gulp.dest(FOLDER));
});

gulp.task("compile-style", function (cb) {
    for (var item in COLORS) {
        gulp.src(CSSMAIN)
            .pipe(replace("themes/default", COLORS[item]))
            .pipe(less())
            .on("error", function (error) {
                console.dir(error);
                this.emit('end');
            })
            .pipe(prefixer())
            .pipe(rename("style_" + item + ".css"))
            .pipe(gulp.dest(FOLDER + "assets/style"));
    }
    return gulp.src(CSSMAIN);
});
gulp.task("compile-image", function () {
    return gulp.src(IMAGES, {base: "src"})
        .pipe(cached("debug", {optimizeMemory: true}))
        .pipe(gulp.dest(FOLDER));
});
gulp.task("compile-font", function () {
    return gulp.src(FONT, {base: "src"})
        .pipe(cached("debug", {optimizeMemory: true}))
        .pipe(gulp.dest(FOLDER));
});

gulp.task("compile-icon", function () {
    return gulp.src(ICONS, {base: "src"})
        .pipe(fontcss({
            fontName: "icon", path: "src/config/iconfont.css.tpl", targetPath: "icon.css"
        }))
        .pipe(iconfont({fontName: "icon", normalize: true}))
        .pipe(gulp.dest(FOLDER + "assets/fonts"));
});
//compile icon to demo
gulp.task("create-demo", function () {
    var files = [];
    return gulp.src(ICONS)
        .pipe(fe(function (stream, file) {
            var name = path.basename(file.path);
            files.push(name.replace(".svg", ""));
            return stream;
        }))
        .on("finish", function () {
            //console.log(files);
            gulp.src("src/views/page/demo/icon.jade")
                .pipe(jade({locals: {icons: files}}))
                .pipe(gulp.dest(FOLDER + "page/demo/"));
        });
});
gulp.task("watch", function (cb) {
    gulp.watch(JADES, ["compile-jade"]);
    gulp.watch(CSSDIR, ["compile-style"]);
    gulp.watch(IMAGES, ["compile-image"]);
    gulp.watch(ICONS, ["compile-icon"]);
    /*gulp.watch(FOLDER + "/!**!/!*", {read: false}).on('change', function (event) {
     browserSync.reload();
     });*/
});


gulp.task('default', ["bundle", "compile-jade", "compile-icon", "compile-lib", "compile-libs",
    "compile-style", "compile-image", "compile-font"]);
gulp.task("dev", ["default"], function () {

    if (TYPE != "DEPLOY") {
        gulp.start("create-demo");
        browserSync.init({
            port: SERVER_PORT,
            ghostMode: false,
            server: FOLDER,
            //middleware: [proxy]
        });
        gulp.start("watch");
        console.log("=========Starting Server=========");
    }
});

gulp.task("server", seq("clear", "dev"));


gulp.task("deploy", seq("deployChangeConfig", "server", "moverBuild", "renameIndex"));

gulp.task("deployChangeConfig", function (cb) {


    FOLDER = "build/";
    TYPE = "DEPLOY";
    //删除bugitild目录文件
    del([FOLDER], cb);
    del([DEPLOY_BUILD], {force: true});
    config = {
        watch: false, cache: {}, packageCache: {},
        setup: function (bundle) {
            bundle.transform('bulkify');
            bundle.transform(babelify);
            bundle.plugin(collapse);
        }
    };
});

gulp.task('moverBuild', function () {
    return gulp.src([FOLDER + '**/*'])
        .pipe(gulp.dest(DEPLOY_BUILD));
});
gulp.task('renameIndex', function () {
    return gulp.src([DEPLOY_BUILD + '/index.html'])
        .pipe(rename("index.scala.html"))
        .pipe(gulp.dest("../app/views"));
});