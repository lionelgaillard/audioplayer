AudioPlayer
===========

jQuery plugin on top of "SoundManager 2" or "SoundJS" to implement a custom audio player.

[SoundManager 2](http://www.schillmania.com/projects/soundmanager2/)
[SoundJS](http://www.createjs.com/#!/SoundJS)

Default options
---------------

See [SoundManager 2 Documentation](http://www.schillmania.com/projects/soundmanager2/doc/#sm-config)
See [SoundJS Documentation](http://www.createjs.com/Docs/SoundJS/modules/SoundJS.html)

```javascript

  DEFAULTS: {

    /**
     * Driver
     *
     * @type {String} 'soundmanager'|'soundjs'
     */
    driver: '',

    /**
     * Directory of SM2's or SoundJS SWF files
     * Required for Flash fallback
     *
     * @type {String}
     */
    url: undefined,

    /**
     * Use Flash, then HTML5 Audio as callback, or inverse
     *
     * @type {Boolean}
     */
    preferFlash: true,

    /**
     * Start playing immediately
     *
     * @type {Boolean}
     */
    autoPlay: true,

    /**
     * Play songs randomly
     *
     * @type {Boolean}
     */
    random: false,

    /**
     * Duration from song start (in milliseconds) within `backward`
     * will go to previous song instead of restart the current song
     *
     * @type {Number}
     */
    backwardDelay: 2000
  }

```


Events
------


### initialized.audioplayer

Triggered after SoundManager and AudioPlayer are initialized.


### play.audioplayer

Every time a song starts.


### pause.audioplayer


### stop.audioplayer

Every time a song stops.


### backward.audioplayer

`backward` actually stop, go backward, then play.


### forward.audioplayer

`forward` actually stop, go forward, then play.


### random.audioplayer

`random` actually stop, jump randomly, then play.


### next.audioplayer

`next` can be `forward` or `random` according to `random` option.


### to.audioplayer


Quick start
-----------

### HTML (minimal)

Only playlist is required (and a play button if `autoPlay` is false).

```html
<div id="player" class="audioplayer">
  <ul class="playlist" data-playlist>
    <li><a href="/music/awesome.mp3">Awesome Song</a></li>
  </ul>
</div>
```


### HTML (full)

```html
<div id="player" class="audioplayer">
  <label data-label></label>
  <button type="button" class="btn" data-backward><i class="icon-backward"></i></button>
  <button type="button" class="btn" data-play><i class="icon-play"></i></button>
  <button type="button" class="btn" data-pause><i class="icon-pause"></i></button>
  <button type="button" class="btn" data-stop><i class="icon-stop"></i></button>
  <button type="button" class="btn" data-forward><i class="icon-forward"></i></button>
  <button type="button" class="btn" data-random><i class="icon-refresh"></i></button>
  <ul class="playlist" data-playlist>
    <li><a href="/music/awesome.mp3">Awesome Song</a></li>
    <li><a href="/music/incredible.mp3" title="Incredible Song"><img src="/img/incredible-song.jpg" /></a></li>
    <li><button type="button" data-url="/music/fantastic.mp3" data-title="Fantastic Song"></button></li>
  </ul>
</div>
```


### Javascript

```javascript
jQuery(function($) {
  $('#player').audioplayer({
    url: '/vendor/schillmania/soundmanager2/swf',
    autoPlay: true
  });
});
```


### CSS (play/pause toggle)

```css
.audioplayer [data-play] {
  display: inline-block;
}
.audioplayer [data-pause] {
  display: none;
}
.audioplayer.playing [data-play] {
  display: none;
}
.audioplayer.playing [data-pause] {
  display: inline-block;
}
```