import { use, init, ComposeOption } from "echarts/core";

import {
  ScatterChart,
  ScatterSeriesOption,
  EffectScatterChart,
  EffectScatterSeriesOption,
} from "echarts/charts";

import { TooltipComponent, TitleComponentOption } from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";

import {
  LeafletComponent,
  LeafletComponentOption,
} from "@joakimono/echarts-extension-leaflet/src/export";

import "leaflet/dist/leaflet.css";
import { tileLayer as LtileLayer, MapOptions } from "leaflet";

// compose required options
type ECOption = ComposeOption<
  ScatterSeriesOption | EffectScatterSeriesOption | TitleComponentOption
  // unite LeafletComponentOption with the initial options of Leaflet `MapOptions`
> &
  LeafletComponentOption<MapOptions>;

// register renderers, components and charts
use([
  CanvasRenderer,
  TooltipComponent,
  LeafletComponent,
  ScatterChart,
  EffectScatterChart,
]);

// define ECharts option
const option: ECOption = {
  lmap: {
    // See https://leafletjs.com/reference.html#map-option for details
    // NOTE: note that this order is reversed from Leaflet's [lat, lng]!
    center: [10, 60], // [lng, lat]
    zoom: 4,
    resizeEnable: true, // automatically handles browser window resize.
    // whether echarts layer should be rendered when the map is moving. Default is true.
    // if false, it will only be re-rendered after the map `moveend`.
    // It's better to set this option to false if data is large.
    renderOnMoving: true,
    echartsLayerInteractive: true, // Default: true
    largeMode: false, // Default: false
    // Note: Please DO NOT use the initial option `layers` to add Satellite/RoadNet/Other layers now.
  },
  title: {
    text: "Scatter chart",
  },
  series: [
    {
      type: "scatter",
      // use `lmap` as the coordinate system
      coordinateSystem: "lmap",
      // data items [[lng, lat, value], [lng, lat, value], ...]
      data: [
        [10, 60, 8],
        [10.1, 60, 20],
      ],
      encode: {
        // encode the third element of data item as the `value` dimension
        value: 2,
      },
    },
    {
      type: "effectScatter",
      // use `lmap` as the coordinate system
      coordinateSystem: "lmap",
      // data items [[lng, lat, value], [lng, lat, value], ...]
      data: [
        [11, 60, 8],
        [11.1, 60, 20],
      ],
      encode: {
        // encode the third element of data item as the `value` dimension
        value: 2,
      },
    },
  ],
};

// initialize echart
const chart = init(document.getElementById("echarts-lmap"));
chart.setOption(option);

// Get Leaflet extension component
// getModel and getComponent do not seem to be exported in echarts typescript
// add the following two comments to circumvent this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const lmapComponent = chart.getModel().getComponent("lmap");
// Get the instance of Leaflet
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const lmap = lmapComponent.getLeaflet();

LtileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, Esri",
  }
).addTo(lmap);
