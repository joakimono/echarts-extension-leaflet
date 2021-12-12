
## Leaflet extension for Apache ECharts

*NOTE*: This is work in progress a fork, which is based on
[echarts-extension-amap](https://github.com/plainheart/echarts-extension-amap) and
[echarts-leaflet](https://github.com/gnijuohz/echarts-leaflet). It supports echarts >=
5.0.1.

This is an Leaflet extension for [Apache
ECharts](https://echarts.apache.org/en/index.html) which is used to display visualizations
such as [Scatter](https://echarts.apache.org/en/option.html#series-scatter),
[Lines](https://echarts.apache.org/en/option.html#series-lines),
[Heatmap](https://echarts.apache.org/en/option.html#series-heatmap).


### Installation

```shell
npm install joakimono/echarts-extension-leaflet --save
```

### Import

Import packaged distribution file `echarts-extension-leaflet.min.js` and add Leaflet API script and ECharts script.

```html
<!-- import JavaScript API of Leaflet, please specify the version and plugins you need -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
<!-- import ECharts -->
<script src="/path/to/echarts.min.js"></script>
<!-- import echarts-extension-leaflet -->
<script src="dist/echarts-extension-leaflet.min.js"></script>
```

You can also import this extension by `require` or `import` if you are using `webpack` or any other bundler.

```js
// use require
require('echarts');
require('echarts-extension-leaflet');

// use import
import * as echarts from 'echarts';
import 'echarts-extension-leaflet';
```

### Notes

  - *Note*: Coordinates are given as `[lng, lat]` for option center.
  - In order to be compatible with echarts' heatmap, the coordinate dimensions are swapped in comparison to Leaflet's convention.
  - When using brush and interacting with other echarts graphics, pressing left Ctrl will disable map dragging while pressed.
  - By default no layers are added, so you need to get the leaflet instance and add it yourself, see below
  - HeatmapSeriesOptions does not recognize 'lmap' as a valid coordinateSystem option, you need to import an extended variant: `import { LeafletHeatmapSeriesOption } from 'echarts-extension-leaflet/export'`

**Apache ECharts 5 import on demand**

Apache ECharts has provided us the [new tree-shaking API](https://echarts.apache.org/en/tutorial.html#Use%20ECharts%20with%20bundler%20and%20NPM) since v5.0.1. This is how to use it in this extension:

```ts
// import scatter, effectScatter and amap extension component on demand
import * as echarts from 'echarts/core';
import {
  ScatterChart,
  ScatterSeriesOption,
  EffectScatterChart,
  EffectScatterSeriesOption
} from 'echarts/charts';
import {
  TooltipComponent,
  TitleComponentOption
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import {
  install as LeafletComponent,
  LeafletComponentOption
} from 'echarts-extension-amap/export';

// import the official type definition for Leaflet
import '@types/leaflet';

// compose required options
type ECOption = echarts.ComposeOption<
  | ScatterSeriesOption
  | EffectScatterSeriesOption
  | TitleComponentOption
  // unite LeafletComponentOption with the initial options of Leaflet `L.MapOptions`
> & LeafletComponentOption<L.MapOptions>;

// register renderers, components and charts
echarts.use([
  CanvasRenderer,
  TooltipComponent,
  LeafletComponent,
  ScatterChart,
  EffectScatterChart
]);

// define ECharts option
const option: ECOption = {
  // Leaflet extension option
  lmap: {
    // ...
  },
  title: {
    // ...
  },
  series: [
    {
      type: 'scatter',
      // Use Leaflet coordinate system
      coordinateSystem: 'lmap',
      // ...
    }
  ]
  // ...
};
```

### Usage

```js
option = {
  // load amap component
  lmap: {
    // initial options of Leaflet
    // See https://leafletjs.com/reference.html#map-option for details
    // initial map center [lng, lat]
    // NOTE: note that this order is reversed from Leaflet's [lat, lng]!
    center: [10, 60],
    // initial map zoom
    zoom: 4,
    // whether the map and echarts automatically handles browser window resize to update itself.
    resizeEnable: true,
    // whether echarts layer should be rendered when the map is moving. Default is true.
    // if false, it will only be re-rendered after the map `moveend`.
    // It's better to set this option to false if data is large.
    renderOnMoving: true,
    // whether echarts layer is interactive. Default value is true
    echartsLayerInteractive: true,
    // whether to enable large mode. Default value is false
    largeMode: false
    // Note: Please DO NOT use the initial option `layers` to add Satellite/RoadNet/Other layers now.
    // There are some bugs about it, we can use `lmap.add` instead.
    // Refer to the codes at the bottom.

    // More initial options...
  },
  series: [
    {
      type: 'scatter',
      // use `lmap` as the coordinate system
      coordinateSystem: 'lmap',
      // data items [[lng, lat, value], [lng, lat, value], ...]
      data: [[120, 30, 8], [120.1, 20]],
      encode: {
        // encode the third element of data item as the `value` dimension
        value: 2
      }
    }
  ]
};

// Get Leaflet extension component
// getModel and getComponent do not seem to be exported in echarts typescript
// add the following two comments to circumvent this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const lmapComponent = chart.getModel().getComponent('lmap');
// Get the instance of Leaflet
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const lmap = lmapComponent.getLeaflet();
// Add some controls provided by Leaflet.
// Make the overlay layer of Leaflet interactive
lmapComponent.setEChartsLayerInteractive(false);
```
