var AudioPlayer = require('../audioplayer-core');
var Sound       = require('createjs').Sound;
var $           = require('jquery');

function SoundJSDriver (player, options) {
  this.player  = player;
  this.options = $.extend({}, this.DEFAULTS, options);

  Sound.addEventListener('fileload', $.proxy(this._onFileload, this));
}

$.extend(SoundJSDriver.prototype, {

  DEFAUTS: {

    /**
     * Directory of SoundJS SWF files
     *
     * @type {String}
     */
    url: undefined
  },

  init: function (callback) {
    callback && callback();
  },

  create: function (id, url) {
    Sound.registerSound(url, id);
  },

  play: function () {
    var track = this.player.getCurrent();

    if (track) {
      track.play();
    }
  },

  pause: function () {
    var track = this.player.getCurrent();

    if (track) {
      track.pause();
    }
  },

  stop: function () {
    var track = this.player.getCurrent();

    if (track) {
      track.stop();
    }
  },

  setPosition: function (position) {
    var track = this.player.getCurrent();

    if (track) {
      track.setPosition(position);
    }
  },

  _onFileload: function (e) {
    var track = Sound.createInstance(e.id);

    track.addEventListener('complete', $.proxy(this.player.next, this.player));

    this.player.add(track);

    if (this.player.options.autoPlay && !this.player.playing) {
      this.player.play();
    }
  }

});

AudioPlayer.prototype.DEFAULTS.driver = 'soundjs';

AudioPlayer.prototype.DRIVERS.soundjs = function (player, options) {
  options = $.extend({}, options, SoundJSDriver.prototype.DEFAULTS),
  plugins = [
    createjs.WebAudioPlugin,
    createjs.HTMLAudioPlugin
  ];

  if (options.url) {
    createjs.FlashPlugin.swfPath = options.url;
  }

  if (options.preferFlash) {
    plugins.unshift(createjs.FlashPlugin);
  } else {
    plugins.push(createjs.FlashPlugin);
  }

  Sound.registerPlugins(plugins);

  return new SoundJSDriver(player, options);
};

module.exports = AudioPlayer.prototype.DRIVERS.soundjs;
