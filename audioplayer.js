(function ($, sm) {

  "use strict";


  // AUDIO PLAYER DEFINITION
  // =======================

  function AudioPlayer (element, options) {
    if ($.isEmptyObject(options.sounds)) {
      throw new Error('AudioPlayer requires "sounds"');
    }

    this.options     = $.extend({}, AudioPlayer.DEFAULTS, options);

    this.$element    = $(element).hide();
    this.id          = this.$element.prop('id');

    if (!this.id) {
      throw new Error('AduioPlayer requires an id');
    }

    this.initialized = false;
    this.playing     = false;
    this.sounds      = [];
    this.index       = -1;

    this.$play       = $('[data-play=#'+this.id+']', this.$element).click($.proxy(this.play, this));
    this.$pause      = $('[data-pause=#'+this.id+']', this.$element).click($.proxy(this.pause, this));
    this.$stop       = $('[data-stop=#'+this.id+']', this.$element).click($.proxy(this.stop, this));
    this.$backward   = $('[data-backward=#'+this.id+']', this.$element).click($.proxy(this.backward, this));
    this.$forward    = $('[data-forward=#'+this.id+']', this.$element).click($.proxy(this.forward, this));
    this.$random     = $('[data-random=#'+this.id+']', this.$element).click($.proxy(this.random, this));
    this.$label      = $('[data-label=#'+this.id+']', this.$element);

    this.update();

    sm.setup({
      url: this.options.url,
      onready: $.proxy(this.init, this)
    });
  }

  AudioPlayer.DEFAULTS = {
    // Directory of SM2's SWF files
    url: '/swf/',
    // Use Flash, then HTML5 Audio as callback, or inverse
    preferFlash: true,
    // Start playing immediately
    autoPlay: true,
    // Play songs randomly
    random: false,
    // Duration from song start (in milliseconds) within `backward`
    // will go to previous song instead of restart the current song
    backwardDelay: 2000,
    // Songs directory
    // { "Song's title": "Song's URL" }
    sounds: {}
  };

  AudioPlayer.prototype = {

    init: function () {
      var self = this,
          onFinish = $.proxy(this.next, this);

      if (this.initialized) {
        return;
      }

      this.sounds = [];
      $.each(this.options.sounds, function (title, url) {
        self.sounds.push(sm.createSound({
          id: title,
          url: url,
          onfinish: onFinish
        }));
      });

      this.initialized = true;

      this.update();

      this.$element.show();

      this.$element.trigger('initialized.audioplayer', this.getCurrent());

      if (typeof this.options.onready == 'function') {
        this.options.onready.call(this.$element);
      }

      if (this.options.autoPlay) {
        this.next();
      }
    },

    update: function () {
      this.$element.toggleClass('playing', this.playing);
      this.$play.prop('disabled', !(this.initialized && !this.playing));
      this.$pause.prop('disabled', !(this.initialized && this.playing));
      this.$stop.prop('disabled', !(this.initialized && this.playing));
      this.$backward.prop('disabled', !(this.initialized));
      this.$forward.prop('disabled', !(this.initialized));
      this.$random.prop('disabled', !(this.initialized));
      this.$label.text(this.getCurrent() ? this.getCurrent().id : '');
    },

    getCurrent: function () {
      if (this.sounds.length) {
        return this.sounds[this.index == -1 ? 0 : this.index];
      }
      return undefined;
    },

    play: function (e) {
      e && e.preventDefault();

      if (this.getCurrent()) {
        sm.play(this.getCurrent().id);
        this.playing = true;
        this.update();
        this.$element.trigger('play.audioplayer', this.getCurrent());
      }
    },

    pause: function (e) {
      e && e.preventDefault();

      if (this.getCurrent()) {
        sm.pause(this.getCurrent().id);
        this.playing = false;
        this.update();
        this.$element.trigger('pause.audioplayer', this.getCurrent());
      }
    },

    stop: function (e) {
      e && e.preventDefault();

      if (this.getCurrent()) {
        sm.stop(this.getCurrent().id);
        this.playing = false;
        this.update();
        this.$element.trigger('stop.audioplayer', this.getCurrent());
      }
    },

    backward: function (e) {
      e && e.preventDefault();

      if (this.getCurrent().position < this.options.backwardDelay) {
        this.stop();
        if (this.index - 1 >= 0) {
          this.index--;
        } else {
          this.index = this.sounds.length - 1;
        }
        this.$element.trigger('backward.audioplayer', this.getCurrent());
        this.play();
      } else {
        sm.setPosition(this.getCurrent().id, 0);
        this.$element.trigger('backward.audioplayer', this.getCurrent());
      }
    },

    forward: function (e) {
      e && e.preventDefault();

      this.stop();
      if (this.index + 1 < this.sounds.length) {
        this.index++;
      } else {
        this.index = 0;
      }
      this.$element.trigger('forward.audioplayer', this.getCurrent());
      this.play();
    },

    random: function (e) {
      var length = this.sounds.length,
          candidates, i;

      e && e.preventDefault();

      if (length == 1) {
        this.stop();
        this.play();
      } else if (length == 2) {
        this.forward();
      } else {
        this.stop();
        candidates = [];
        for (i in this.sounds) {
          if (i != this.index) {
            candidates.push(i);
          }
        }
        this.index = candidates[Math.floor(Math.random() * candidates.length)];
        this.$element.trigger('random.audioplayer', this.getCurrent());
        this.play();
      }
    },

    next: function (e) {
      if (this.options.random) {
        this.random();
      } else {
        this.forward();
      }
      this.$element.trigger('next.audioplayer', this.getCurrent());
    }
  };


  // AUDIO PLAYER PLUGIN DEFINITION
  // ==============================

  var old = $.fn.audioplayer;

  $.fn.audioplayer = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('wxr.audioplayer'),
          options = typeof option == 'object' && option;

      if (!data) {
        $this.data('wxr.audioplayer', (data = new AudioPlayer(this, options)));
      }

      if (typeof option == 'string') {
        data[option]();
      }
    });
  };


  // AUDIO PLAYER NO CONFLICT
  // ========================

  $.fn.audioplayer.noConflict = function () {
    $.fn.audioplayer = old;
    return this;
  };

})(window.jQuery, window.soundManager);