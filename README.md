# jQuery-fireworks

A jQuery plugin that draws fireworks on top of a div using an HTML canvas.

## Usage

```js
$("#divElement").fireworks();
```

### Options

```js
$("#divElement").fireworks({
  opacity: 0.4,
  width: 400,
  height: 300
});
```

- `opacity`: Canvas opacity. Default is `1`.
- `width`: Canvas width in pixels. Default is the element width.
- `height`: Canvas height in pixels. Default is the element height.

## Example

Open `index.html` for a styled demo of the plugin in action.

```html
<div id="demo-fireworks"></div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="jquery.fireworks.js"></script>
<script>
  $(function() {
    $("#demo-fireworks").fireworks({ opacity: 0.85 });
  });
</script>
```
