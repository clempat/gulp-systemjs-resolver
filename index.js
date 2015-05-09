'use strict';
var gutil   = require('gulp-util');
var through = require('through2');
var fs      = require('fs');
var System  = require('systemjs');
var RSVP    = require('rsvp');
var Promise = require('rsvp').Promise;
var path    = require('path');

var regex = /@import\s*['"](~.*)['"];?\s*?/mig;

module.exports = function(options) {
	if (!options || !options.systemConfig) {
		throw new gutil.PluginError('gulp-systemjs-resolver', '`systemConfig` required');
	}

	eval(fs.readFileSync(options.systemConfig, 'utf8'));

	return through.obj(function(file, enc, cb) {
		var replacements = [],
				self         = this;

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-systemjs-resolver', 'Streaming not supported'));
			return;
		}

		/**
		 * Use systemjs to resolve path
		 * @param val
		 * @param i
		 * @returns {*}
		 */
		function resolve(val, i) {
			val = val.replace('~', '');
			return Promise.resolve(System.normalize(val))
					.then(function(normalized) {
						return System.locate({name: normalized, metadata: {}});
					})
					.then(function(address) {
						replacements[i] = address.replace('file:', '').replace('.js', '');
					});
		}

		/**
		 * Extract the file path from @import "filepath"
		 * @param val
		 * @returns {XML|string|void}
		 */
		function extractFile(val) {
			return val.replace(regex, '$1');
		}

		/**
		 * Resolve the imports
		 * @param fileContent
		 */
		function resolveAll(fileContent) {
			var matches = fileContent.match(regex).map(extractFile);

			if (!matches) {
				return new RSVP.Promise(function(resolve) {
					resolve(fileContent)
				});
			}

			var promises = matches.map(resolve);

			return RSVP.all(promises).then(function() {
				for (var i = 0, len = matches.length; i < len; i++) {
					fileContent = fileContent.replace(matches[i], path.relative(file.base, replacements[i]));
				}

				return fileContent;
			});

		}

		resolveAll(file.contents.toString()).then(function(newFileContent) {
			file.contents = new Buffer(newFileContent);
		}).catch(function(err) {
			self.emit('error', new gutil.PluginError('gulp-systemjs-resolver', err));
		}).finally(function() {
			self.push(file);
			cb();
		});
	});
};
