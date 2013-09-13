AudioPlayer
===========

jQuery plugin on top of "SoundManager 2" to implement a custom audio player.

[SoundManager 2](http://www.schillmania.com/projects/soundmanager2/)


Default options
---------------

See [SoundManager 2 Documentation](http://www.schillmania.com/projects/soundmanager2/doc/#sm-config)

```javascript

  AudioPlayer.DEFAULTS = {
    // Directory of SM2's SWF files
    url: '/vendor/schillmania/soundmanager2/swf',
    // Use Flash, then HTML5 Audio as callback, or inverse
    preferFlash: true,
    // Start playing immediately
    autoPlay: true,
    // Play songs randomly
    random: false,
    // Duration from song start (in milliseconds) within `backward`
    // will go to previous song instead of restart the current song
    backwardDelay: 2000
  };

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

### HTML

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