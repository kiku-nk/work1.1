const gulp = require('gulp');
const gulpSass = require('gulp-sass')(require('sass'));
const sassGlob = require("gulp-sass-glob");
const postcss = require('gulp-postcss');
const postcss100vhfix = require('postcss-100vh-fix');
const postcssPresetEnv = require('postcss-preset-env');

const htmlbeautify = require("gulp-html-beautify");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const ejs =require("gulp-ejs");

const cssPlugins = [
  postcssPresetEnv({
    // features の中から rem: false を削除
    // 他に必要な設定があればここに追加
  }),
  postcss100vhfix,
];

//vendor
gulp.task("vendor", () => {
  return gulp.src([
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/jquery/dist/jquery.min.map",
  ], { base: "node_modules" })
    .pipe(plumber())
    .pipe(rename(path => {
      path.dirname =
        path.dirname
          .replace(/\/dist(?=\/|$)/, "")
          .replace(/\\dist(?=\\|$)/, "");
      path.extname =
        path.extname
          .replace(/\.less$/, ".css");
    }))
    .pipe(gulp.dest("public_html/kiku1120.shop/js/vendor"));
});
//scss
gulp.task("scss", () => {
  return gulp.src([
    "src/scss/**/*.scss",
  ])
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(gulpSass({ outputStyle: "expanded", indentType: "tab", indentWidth: 1 }))
    .pipe(postcss(cssPlugins))
    .pipe(gulp.dest("public_html/kiku1120.shop/css"));
});
//html
gulp.task("html", () => {
  return gulp.src([
    "src/html/*.html", "!src/html/_*.html",
  ]).pipe(gulp.dest("public_html/kiku1120.shop/"));
});
//ejs
gulp.task("ejs", () => {
	return gulp.src([
		"src/ejs/**/*.ejs", "!src/ejs/**/_*.ejs"
	]).pipe(ejs())
    .pipe(htmlbeautify({
      "indent_size": 1,
      "indent_char": "\t",
      "max_preserve_newlines": 0,
      "preserve_newlines": true,
      "extra_liners": [],
    }))
		.pipe(rename({ extname: ".html" }))
		.pipe(gulp.dest("public_html/kiku1120.shop/"));
});
//js
// gulp.task("js", () => {
// 	return gulp.src([
// 		"src/js/**/*.js"
// 	]).pipe(gulp.dest("public_html/kiku1120.shop/js"));
// });
//images
// js
gulp.task("js", (done) => {
  // js ファイルを使わない場合は何も処理しない
  done();
});
gulp.task("images", () => {
  return gulp.src([
    "src/images/**/*",
  ]).pipe(gulp.dest("public_html/kiku1120.shop/images"));
});
//fabicon
gulp.task("fabicon", () => {
  return gulp.src([
    "src/*.ico", "src/*.png",
  ]).pipe(gulp.dest("public_html/kiku1120.shop"));
});


function watchChangeFlie() {
  gulp.watch("src/scss/**/*.scss", gulp.series("scss"));
  gulp.watch("src/html/*.html", gulp.series("html"));
  gulp.watch("src/ejs/**/*.ejs", gulp.series("ejs"));
  // gulp.watch("src/js/**/*.js", gulp.series("js"));
  gulp.watch("src/images/**/*", gulp.series("images"));
  gulp.watch(["src/*.ico", "src/*.png"], gulp.series("fabicon"));
}

gulp.task("default", gulp.series("vendor", "scss", "html", "ejs", "js", "images", "fabicon", ));
gulp.task("watch", gulp.series("vendor", "scss", "html", "ejs", "js", "images", "fabicon", gulp.parallel(watchChangeFlie)));