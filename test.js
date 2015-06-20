'use strict';
var assert         = require('assert');
var RSVP           = require('rsvp');
var gutil          = require('gulp-util');
var systemResolver = require('./');

var fixture = [
	"/* @importPath '~bourbon' */",
	'@import "~bourbon/test.scss"',
	"@import '~neat/test.scss'",
	"@import './variable/test.scss'",
	'p {background-color: 10px}'
].join('\n');

var expected = [
	"/* @importPath '~bourbon' */",
	'@import "path/resolved/bourbon/test.scss"',
	"@import 'path/resolved/neat/test.scss'",
	"@import './variable/test.scss'",
	'p {background-color: 10px}'
].join('\n');

var includePaths = [];

it('should resolve the import string', function(done) {
	var stream = systemResolver({systemConfig: './fixtures/config.js', includePaths: includePaths});

	stream.write(new gutil.File({
		base    : '/drive/app',
		path    : '/drive/app' + '/file.ext',
		contents: new Buffer(fixture)
	}));

	stream.on('data', function(file) {
		assert.strictEqual(file.contents.toString('utf8'), expected);
		assert.deepEqual(includePaths, ['/drive/app' + "/path/resolved/bourbon"]);
		done();
	});

	RSVP.on('error', done);
});

it('shoud not throw exception when no resolution needed', function(done) {
	var stream = systemResolver({systemConfig: './fixtures/config.js', includePaths: includePaths});

	stream.write(new gutil.File({
		base    : '/drive/app',
		path    : '/drive/app' + '/file.ext',
		contents: new Buffer("@import './variable/test.scss'")
	}));

	stream.on('data', function(file) {
		assert.strictEqual(file.contents.toString('utf8'), "@import './variable/test.scss'");
		done();
	});

	RSVP.on('error', done);

});

it('should append path', function(done) {
	includePaths = ['Exemple1'];
	var stream = systemResolver({systemConfig: './fixtures/config.js', includePaths: includePaths});

	stream.write(new gutil.File({
		base    : '/drive/app',
		path    : '/drive/app' + '/file.ext',
		contents: new Buffer(fixture)
	}));

	stream.on('data', function(file) {
		assert.strictEqual(file.contents.toString('utf8'), expected);
		assert.deepEqual(includePaths, ["Exemple1", '/drive/app' + "/path/resolved/bourbon"]);
		done();
	});

	RSVP.on('error', done);
});


it('should resolve path', function(done) {
	includePaths = [];
	var stream = systemResolver({systemConfig: './fixtures/config.js', includePaths: includePaths});

	stream.write(new gutil.File({
		base    : '/drive/app',
		path    : '/drive/app' + '/file.ext',
		contents: new Buffer('/* @importPath "~bourbon" */')
	}));

	stream.on('data', function(file) {
		assert.strictEqual(file.contents.toString('utf8'), '/* @importPath "~bourbon" */');
		assert.deepEqual(includePaths, [ '/drive/app' + "/path/resolved/bourbon"]);
		done();
	});

	RSVP.on('error', done);
});
