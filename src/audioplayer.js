var AudioPlayer  = require('./audioplayer-core');
var SoundJS      = require('./drivers/soundjs');
var SoundManager = require('./drivers/soundmanager');
var $            = require('jquery');

module.exports.soundjs = function (element, options) {
  return new AudioPlayer(element, $.extend(options, {
    driver: 'soundjs'
  }));
};

module.exports.soundmanager = function (element, options) {
  return new AudioPlayer(element, $.extend(options, {
    driver: 'soundmanager'
  }));
};
