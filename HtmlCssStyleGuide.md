# HTML/CSS StyleGuid

1. Only 1 HTML tag/text per line

Bad:
``` HTML
<div>
  <img src="assets/player.svg"/><span id="playerName"></span>

  <button>Удалить<img src="assets/trash.svg"></button>
</div>
```

Good:
``` HTML
<div>
  <img src="assets/player.svg"/>
  <span id="playerName"></span>

  <button>
    Удалить
    <img src="assets/trash.svg">
  </button>
</div>
```

2. No [snake_case](https://ru.wikipedia.org/wiki/Snake_case) for id/name and other attributes. Use [lowerCamelCase](https://ru.wikipedia.org/wiki/CamelCase)

Bad:
``` HTML
<span id="player_name"></span>
```

Good:
``` HTML
<span id="playerName"></span>
```

3. No inline styles

Bad:
``` HTML
<style>
  .player {
    text-color: #000000; 
  }
</style>
```

Good:
``` HTML
<link rel="stylesheet" type="text/css" href="player.css">
```

4. No inline SVG graphics. Only img tags. If needed - create 2 or more separate files in assets folder

Bad:
``` HTML
<li>
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <style>
        .lights {
          fill: url(#turnedOn_gradient);
          fill-rule: evenodd;
          filter: url(#filter_lights);
        }
      </style>
    </defs>
  </svg>
</li>
```

Good:
``` HTML
<li>
  <img src="assets/lowBeamInactive.svg"/>
  <img src="assets/lowBeamActive.svg" styles="display: hidden;"/>
</li>
```

# CSS style guide

1. No style class = inactive. If element have multiple states
2. Separate class for active state
3. Hide elements using inline styles with `display: hidden;`
4. No style selectors by id. Use classes or/and tag selectors