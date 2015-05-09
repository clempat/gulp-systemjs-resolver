# gulp-sass-resolver [![Build Status](https://travis-ci.org/clempat/gulp-systemjs-resolver.svg?branch=master)](https://travis-ci.org/clempat/gulp-systemjs-resolver)

> My Sass Import resolver using systemjs gulp plugin


## Install

```
$ npm install --save-dev gulp-systemjs-resolver
```


## Usage

```js
var gulp = require('gulp');
var sassResolver = require('gulp-systemjs-resolver');

gulp.task('sass', function () {
	return gulp.src('src/file.scss')
		.pipe(sassResolver({systemConfig: './config.js'}))
		.pipe(gulp.dest('dist'));
});
```


## API

### systemResolver(options)

#### options

##### systemConfig

Type: `string`  
Default: ``

This is the path to the SystemJs config file for example `./config.js`


## License

MIT © [Clément Patout](https://github.com/clempat)
