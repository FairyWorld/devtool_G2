# Brush Interaction

## Brush highlight

```js | dom
G2.render({
  type: 'interval',
  data: [
    { genre: 'Sports', sold: 275, type: 'A' },
    { genre: 'Strategy', sold: 115, type: 'B' },
    { genre: 'Action', sold: 120, type: 'C' },
    { genre: 'Shooter', sold: 350, type: 'D' },
    { genre: 'Other', sold: 150, type: 'E' },
  ],
  encode: {
    x: 'genre',
    y: 'sold',
  },
  interaction: [{ type: 'brushHighlight' }]
});
```

## Brush highlight with `x-rect` mask

```js | dom
G2.render({
  type: 'interval',
  data: [
    { genre: 'Sports', sold: 275, type: 'A' },
    { genre: 'Strategy', sold: 115, type: 'B' },
    { genre: 'Action', sold: 120, type: 'C' },
    { genre: 'Shooter', sold: 350, type: 'D' },
    { genre: 'Other', sold: 150, type: 'E' },
  ],
  encode: {
    x: 'genre',
    y: 'sold',
  },
  interaction: [{ type: 'brushHighlight', maskType: 'x-rect' }]
});
```

## Brush highlight with `y-rect` mask

```js | dom
G2.render({
  type: 'interval',
  data: [
    { genre: 'Sports', sold: 275, type: 'A' },
    { genre: 'Strategy', sold: 115, type: 'B' },
    { genre: 'Action', sold: 120, type: 'C' },
    { genre: 'Shooter', sold: 350, type: 'D' },
    { genre: 'Other', sold: 150, type: 'E' },
  ],
  encode: {
    x: 'genre',
    y: 'sold',
  },
  interaction: [{ type: 'brushHighlight', maskType: 'y-rect' }]
});
```
