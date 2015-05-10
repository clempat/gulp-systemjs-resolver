# gulp-systemjs-resolver [![Build Status](https://travis-ci.org/clempat/gulp-systemjs-resolver.svg?branch=master)](https://travis-ci.org/clempat/gulp-systemjs-resolver)

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

I personally in my project use jspm and configure the package this way for bourbon:
```json
{
  "jspm": {
    "dependencies": {
      "bourbon": "github:thoughtbot/bourbon@^4.2.3"
    },
    "overrides": {
      "github:thoughtbot/bourbon@4.2.3": {
        "directories": {
          "lib": "bourbon-v4.2.3"
        }
      }
    }
  }
}
```

Then in your scss file, you can import like:

```sass
@import "~bourbon/_bourbon.scss"; //Import bourbon file
@import "./variable.scss"; // Import local file
```

or

```sass
/* @import '~bourbon' */
@import "_bourbon.scss"; //Import bourbon file
@import "./variable.scss"; // Import local file
```

## API

### systemjsResolver(options)

#### options

##### systemConfig

Type: `string`  
Default: ``

This is the path to the SystemJs config file for example `./config.js`


## License

MIT © [Clément Patout](https://github.com/clempat)
