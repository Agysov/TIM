var	gulp           = require('gulp'),
	rename 		   = require('gulp-rename'),
	gutil          = require('gulp-util' ),
	sass           = require('gulp-sass'),
	browserSync    = require('browser-sync'),
	concat         = require('gulp-concat'),
	uglify         = require('gulp-uglify'),
	cleanCSS       = require('gulp-clean-css'),
	del            = require('del'),
	imagemin       = require('gulp-imagemin'),
	cache          = require('gulp-cache'),
	autoprefixer   = require('gulp-autoprefixer'),
	ftp            = require('vinyl-ftp'),
	notify         = require("gulp-notify"),
	rigger 		   = require('gulp-rigger'),
	rsync          = require('gulp-rsync'),
	spritesmith    = require('gulp.spritesmith');

//  Скрипты bower компонентов

gulp.task('vendor-js', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/dist/js/bootstrap.min.js',
		'app/libs/slick-carousel/slick/slick.min.js', // Добавить вконце *.min.js нового bower компонента
		])
	.pipe(concat('vendor.min.js'))
	.pipe(gulp.dest('app/js'));
});

// мои скрипты

gulp.task('script-js', function() {
	return gulp.src(['!app/js/script.js', '!app/js/script.min.js', '!app/js/vendor.min.js', 'app/js/*.js'])
	// .pipe(rigger()) // Раскоментировать если в main.js подклюены файлы
	.pipe(rename({basename: "script"}))
	.pipe(gulp.dest('app/js'))
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

// Раскоментировать если нужно склеить vendor.min.js и script.min.js и добавить этот таск в таск watch или build

// gulp.task('js', ['vendor-js', 'script-js'], function() {
// 	return gulp.src([
// 		'app/js/vendor.min.js',
// 		'app/js/script.min.js',
// 		])
// 	.pipe(concat('script.min.js'))
// 	.pipe(gulp.dest('app/js'))
// 	.pipe(browserSync.reload({stream: true}));
// });

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('vendor-sass', function() {
	return gulp.src('app/sass/vendor.+(sass|scss)')
	.pipe(sass({outputStyle: 'compressed'}).on("error", notify.onError()))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(rename({basename: "vendor"}))
	//.pipe(cleanCSS()) // Раскомментировать если в vendor.scss подключены НЕминифицированные файлы
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('style-sass', function() {
	return gulp.src(['!app/sass/**/vendor.+(sass|scss)', 'app/sass/**/*.+(sass|scss)'])
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(rename({basename: "style"}))
	.pipe(gulp.dest('app/css'))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

// Раскоментировать если нужно склеить vendor.min.css и script.min.css и добавить этот таск в таск watch

// gulp.task('css', ['vendor-js', 'script-js'], function() {
// 	return gulp.src([
// 		'app/css/vendor.min.css',
// 		'app/css/script.min.css',
// 		])
// 	.pipe(concat('style.min.css'))
// 	.pipe(gulp.dest('app/css'))
// 	.pipe(browserSync.reload({stream: true}));
// });

gulp.task('html', function(){
	return gulp.src(['app/html_dev/[^_]*.html'])
	.pipe(rigger())
	.pipe(gulp.dest('app'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['vendor-sass', 'style-sass', 'vendor-js', 'script-js', 'html', 'browser-sync'], function() {
	gulp.watch(['!app/sass/**/vendor.+(sass|scss)', 'app/sass/**/*.+(sass|scss)'], ['style-sass']);
	gulp.watch('app/sass/**/vendor.+(sass|scss)', ['vendor-sass']);
	// gulp.watch(['bower.json'], ['vendor-js']);
	gulp.watch(['!app/js/script.js', '!app/js/script.min.js', '!app/js/vendor.min.js', 'app/js/[^_]*.js'], ['script-js']);
	gulp.watch('app/html_dev/*.html', ['html']);
});

gulp.task('imagemin', function() {
	return gulp.src(['!app/img/imgForSprite/**/*', 'app/img/**/*'])
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'vendor-sass', 'style-sass', 'vendor-js', 'script-js'], function() {

	var buildFiles = gulp.src(['app/*.html', 'app/.htaccess',])
		.pipe(gulp.dest('dist'));

	var buildCss = gulp.src(['app/css/vendor.min.css', 'app/css/style.min.css'])
		.pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src(['app/js/vendor.min.js', 'app/js/script.min.js'])
		.pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src(['app/fonts/**/*',])
		.pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function() {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		archive: true,
		silent: false,
		compress: true
	}));
});

gulp.task('sprite', function () {
	var spriteData = gulp.src('app/img/imgForSprite/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.scss'
	}));
	return spriteData.pipe(gulp.dest('app/img/sprites'));
});

gulp.task('removedist', function() {
	return del.sync('dist');
});

gulp.task('clearcache', function () {
	return cache.clearAll();
});

gulp.task('default', ['watch']);