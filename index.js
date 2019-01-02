var debug = require('debug')('metalsmith-localize-collections');

'use stritc';

module.exports = function (name) {
  return function (files, metalsmith, callback) {
    var metadata = metalsmith.metadata();
    var collections = metadata.collections;
    var collection = collections[name] || null;

    if (!collection) {
      return;
    }

    metadata.locales.forEach(function (locale) {
      if (!collections[name + '_' + locale]) {
        collections[name + '_' + locale] = [];
      }
    });

    function workFile(file) {
      var locale = file.locale || metadata.defaultLocale || null;

      if (!locale) {
        return;
      }

      var collection = collections[name + '_' + locale];
      collection.push(file);
    }

    collection.forEach(workFile);

    // update previous and next depending on new collections
    metadata.locales.forEach(function (locale) {
      var collection = collections[name + '_' + locale];
      if (!collection)
	return;
 
      collection.forEach(function(file, i){
        var last = collection.length - 1;
        debug('adding metadata: %s', file.title);
        if (0 != i) file.previous = collection[i-1];
        else file.previous = null;
        if (last != i) file.next = collection[i+1];
        else file.next = null;
      });
    });

    callback();
  };
}

