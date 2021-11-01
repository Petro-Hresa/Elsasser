// ***********************
/* 0-Paths */
/* 1-Tasks */
/* 2-Exports_Tasks */
// ***********************

"use strict";

const {src, dest} = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const uglify = require('gulp-uglify-es').default;
const panini = require("panini");
const cssbeautify = require("gulp-cssbeautify");
const imagemin = require("gulp-imagemin");
const del = require("del");
const browserSync = require("browser-sync").create();
const groupmedia = require('gulp-group-css-media-queries');
const fileinclude = require("gulp-file-include");
const webp = require('gulp-webp');
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const fonter = require("gulp-fonter");
const removeComments = require('gulp-strip-css-comments');
// const typeScript = require('gulp-typescript');

/* 0-Paths */
const srcPath = '#src/';
const distPath = 'dist/';
const fs = require('fs');
// const tsProject = typeScript.createProject('tsconfig.json')


const path = {
    build: {
        img:    distPath + "assets/images/",
        html:   distPath,
        css:    distPath + "assets/styles/",
        js:     distPath + "assets/scripts/",
        fonts:  distPath + "assets/fonts/"

    },
    src: {
        img:    srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        html:   srcPath + "*.html",
        css:    srcPath + "assets/styles/style.scss",
        cssB:   srcPath + "assets/styles/vendors/bootstrap-customized.scss",
        js:     srcPath + "assets/scripts/script.js",
     
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    watch: {
        img:    srcPath + "assets/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        html:   srcPath + "**/*.html",
        css:    srcPath + "assets/styles/**/*.scss",
        cssB:   srcPath + "assets/styles/vendors/bootstrap-customized.scss",
        js:     srcPath + "assets/scripts/**/*.js",

    },
    clean: "./" + distPath + "/"
}


/* 1-Tasks */
function serve() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath + "/"
        },
        port: 3000,
        notify: false
    });
}


const images = () => {
    return src(path.src.img)
    .pipe(webp({quality: 70}))
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(imagemin({
        quality: 95,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3,
    }))
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream())
}


const fontsStyle = (params) => {
    let file_content = fs.readFileSync(srcPath + 'assets/styles/fonts/_fonts.scss');
    if (file_content == '') {
      fs.writeFile(srcPath + 'assets/styles/fonts/_fonts.scss', '', cb);
      return fs.readdir(path.build.fonts, function (err, items) {
        if (items) {
          let c_fontname;
          for (var i = 0; i < items.length; i++) {
            let fontname = items[i].split('.');
            fontname = fontname[0];
            if (c_fontname != fontname) {
              fs.appendFile(srcPath + 'assets/styles/fonts/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
            }
            c_fontname = fontname;
          }
        }
      })
    }
  }


const fonts = () => {
    src(path.src.fonts)
   .pipe(ttf2woff())
   .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
   .pipe(ttf2woff2())
   .pipe(dest(path.build.fonts))
}


gulp.task('otf2ttf', () => {
    return gulp.src([srcPath + 'assets/fonts/*.otf'])
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(dest(distPath + 'assets/fonts/'))
});


const html = () =>{
    panini.refresh();
    return src(path.src.html)
    .pipe(panini({
        root:       srcPath,
        layouts:    srcPath + 'layouts/',
        partials:   srcPath + 'partials/',
        helpers:    srcPath + 'helpers/',
        data:       srcPath + 'data/'
    }))
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({stream: true}));
}


const css = () => {
    return src(path.src.css)
    .pipe(sass({
        includePaths: './node_modules/',
        outputStyle: "expanded"
    }))
    .pipe(autoprefixer({cascade: true})) 
    .pipe(groupmedia())
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(cssnano({
        zindex: false,
        discardComments: {removeAll: true}
    }))
    .pipe(removeComments())
    .pipe(rename({extname: ".min.css"}))
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream())
}


const cssB = () => {
    return src(path.src.cssB)
    .pipe(sass({
        includePaths: './node_modules/',
        outputStyle: "expanded"
    }))
    .pipe(autoprefixer({cascade: true})) 
    .pipe(groupmedia())
    .pipe(cssbeautify())
    // .pipe(dest(path.build.css))
    .pipe(cssnano({
        zindex: false,
        discardComments: {removeAll: true}
    }))
    // .pipe(removeComments())
    .pipe(rename({extname: ".min.css"}))
    .pipe(dest(path.build.css))
    // .pipe(browserSync.stream())
}


const js = () => {
    return src(path.src.js)
    // .pipe(tsProject())
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({extname: ".min.js"}))
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream())
}


const watchFiles = () => {
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.cssB], cssB);
    gulp.watch([path.watch.js], js);
}


const clean = () => del(path.clean);
const build = gulp.series(gulp.parallel( images, fontsStyle, fonts, html, cssB,  css, js), clean);
const watch = gulp.parallel(build, serve, watchFiles);


/* 2-Exports_Tasks */
exports.images = images;
exports.html = html;
exports.css = css;
exports.cssB = cssB;
exports.js = js;
exports.fonts = fonts;                                                                                                  
exports.fontsStyle = fontsStyle;
exports.build = build;
exports.watch = watch;
exports.default = watch;


