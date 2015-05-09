'use strict';
var assert         = require('assert');
var RSVP           = require('rsvp');
var gutil          = require('gulp-util');
var systemResolver = require('./');

var fixture = [
	'@import "bourbon/test.scss"',
	"@import 'neat/test.scss'",
	'p {background-color: 10px}'
].join('\n');

var expected = [
	'@import "path/resolved/bourbon/test.scss"',
	"@import 'path/resolved/neat/test.scss'",
	'p {background-color: 10px}'
].join('\n');

it('should resolve the import string', function(done) {
	var stream = systemResolver({systemConfig: './fixtures/config.js'});

	stream.write(new gutil.File({
		base    : __dirname,
		path    : __dirname + '/file.ext',
		contents: new Buffer(fixture)
	}));

	stream.on('data', function(file) {
		assert.strictEqual(file.contents.toString('utf8'), expected);
		done();
	});

	RSVP.on('error', done);
});
