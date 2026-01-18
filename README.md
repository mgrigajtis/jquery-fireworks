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

## jQuery

```html
<div id="demo-fireworks"></div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="fireworks.core.js"></script>
<script src="jquery.fireworks.js"></script>
<script>
  $(function() {
    $("#demo-fireworks").fireworks({ opacity: 0.85 });
  });
</script>
```

## Examples

- `index.html` uses jQuery + the core module.
- `examples/vanilla.html` uses the core module directly.
- `examples/react.html` shows a React integration using CDNs.
- `examples/angularjs.html` shows an AngularJS directive.
- `frameworks/angular/fireworks.component.ts` contains an Angular (2+) component wrapper.

## VanillaJS

```html
<div id="demo-fireworks"></div>

<script src="fireworks.core.js"></script>
<script>
  Fireworks.createFireworks(document.getElementById("demo-fireworks"), {
    opacity: 0.85
  });
</script>
```

## React

```js
import { useEffect, useRef } from "react";

export function FireworksBox({ options }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !window.Fireworks) {
      return;
    }
    const instance = window.Fireworks.createFireworks(ref.current, options || {});
    return () => instance && instance.destroy();
  }, [options]);

  return <div ref={ref} className="fireworks-host" />;
}
```

## Angular (2+)

Include `fireworks.core.js` globally (for example in `angular.json` scripts), then use:

```ts
// See frameworks/angular/fireworks.component.ts
```
