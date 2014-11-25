var AudioPlayer  = require('../audioplayer-core');
var soundManager = require('soundManager');
var $            = require('jquery');

function SoundManagerDriver (player, options) {
  this.player  = player;
  this.options = $.extend({}, this.DEFAULTS, options);
}

$.extend(SoundManagerDriver.prototype, {

  DEFAUTS: {

    /**
     * Directory of SM2's SWF files
     *
     * @type {String}
     */
    url: undefined

  },

  init: function (callback) {
    soundManager.setup($.extend({
      onready: callback
    }, this.options));
  },

  create: function (id, url) {
    var onComplete = $.proxy(this.player.next, this.player);

    this.player.add(soundManager.createSound({
      id: id,
      url: url,
      onfinish: onComplete
    }));
  },

  play: function () {
    soundManager.play(this.player.getCurrent().id);
  },

  pause: function () {
    soundManager.pause(this.player.getCurrent().id);
  },

  stop: function () {
    soundManager.stop(this.player.getCurrent().id);
  },

  setPosition: function (position) {
    soundManager.setPosition(this.player.getCurrent().id, position);
  }

});

AudioPlayer.prototype.DEFAULTS.driver = 'soundManager';

AudioPlayer.prototype.DRIVERS.soundManager = function (player, options) {
  return new SoundManagerDriver(player, options);
};

module.exports = AudioPlayer.prototype.DRIVERS.soundManager;
