var gulp = require('gulp');
var tsc = require('gulp-typescript-compiler');
var tsd = require("gulp-tsd");
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');
var shell = require('gulp-shell');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var header = require('gulp-header');

// Build Tasks for Chrome Extension

gulp.task('compile-chrome-extension', function () {
    return gulp.src('chrome-extension/src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('chrome-extension/screenshare_chrome_extension/')
    );
});

gulp.task('copy-extension-files', function () {
    return gulp.src(['chrome-extension/src/*.png','chrome-extension/src/manifest.json'],{base: 'chrome-extension/src'})
        .pipe(gulp.dest('chrome-extension/screenshare_chrome_extension/')
    );
});

gulp.task('compile-chrome-extension-zip',['compile-chrome-extension','copy-extension-files'], function() {
    gulp.src(['chrome-extension/screenshare_chrome_extension/*'])
        .pipe(zip('screenshare_chrome_extension.zip'))
        .pipe(gulp.dest('chrome-extension/'))
});

// Build Tasks for Firefox Addon

gulp.task('compile-ff-addon', function () {
    return gulp.src(['firefox-addon/src/data/*.js','firefox-addon/src/defaults/preferences/*.js','firefox-addon/src/lib/*.js'],{base: 'firefox-addon/src'})
        .pipe(uglify())
        .pipe(gulp.dest('firefox-addon/screenshare_firefox_addon/')
    );
});

gulp.task('copy-ff-addon-files', function () {
    return gulp.src(['firefox-addon/src/*.png','firefox-addon/src/package.json'],{ base: 'firefox-addon/src' })
        .pipe(gulp.dest('firefox-addon/screenshare_firefox_addon/')
    );
});

gulp.task('pre-compile-ff-addon-xpi', function() {
    gulp.src(['firefox-addon/src/'])
        .pipe(plumber())
        .pipe(shell([
            'cfx xpi --pkgdir <%= file.path %> --output-file firefox-addon/screenshare_firefox_addon.xpi'
        ]));
});

gulp.task('compile-ff-addon-xpi',['compile-ff-addon','copy-ff-addon-files'], function() {
    gulp.src(['firefox-addon/screenshare_firefox_addon/'])
        .pipe(shell([
            'cfx xpi --pkgdir <%= file.path %> --output-file firefox-addon/screenshare_firefox_addon.xpi'
        ]))
});

// Build Tasks for Library

var pkg = require("./package.json");
var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @author <%= pkg.author.name %>(<%= pkg.author.email %>)',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

gulp.task("tsd-install", function (callback) {
    tsd({
        command: "reinstall",
        config: "src/tsd.json"
    }, callback);
});

gulp.task('tsc-library', function () {
    return gulp.src('src/screenshare.ts')
        .pipe(tsc({
            module: '',
            sourcemap: false,
            declarationFiles: true,
            logErrors: true
        }))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist/')
    );
});

gulp.task('compile-library',['tsc-library',"tsd-install"], function () {
    gulp.src('dist/screenshare.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(rename('screenshare.min.js'))
        .pipe(gulp.dest('dist/')
    );
});

gulp.task('build-library',['compile-library'],function(){
});

gulp.task('pre-build-firefox',['pre-compile-ff-addon-xpi'],function(){
});

gulp.task('build-firefox',['compile-ff-addon-xpi'],function(){
});

gulp.task('build-chrome',['compile-chrome-extension-zip'],function(){
});
