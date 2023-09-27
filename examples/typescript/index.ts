import { use, init, ComposeOption } from "echarts/core";

import {
  ScatterChart,
  ScatterSeriesOption,
  EffectScatterChart,
  EffectScatterSeriesOption,
  HeatmapChart,
  //HeatmapSeriesOption, // import LeafletHeatmapSeriesOption instead
} from "echarts/charts";

import {
  TooltipComponent,
  TitleComponentOption,
  VisualMapComponent,
  VisualMapComponentOption,
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";

import {
  LeafletComponent,
  LeafletComponentOption,
  LeafletHeatmapSeriesOption,
} from "@joakimono/echarts-extension-leaflet/src/export";

import "leaflet/dist/leaflet.css";
import { tileLayer as LtileLayer, MapOptions } from "leaflet";

// compose required options
type ECOption = ComposeOption<
  | TitleComponentOption
  | VisualMapComponentOption
  | LeafletHeatmapSeriesOption
  | ScatterSeriesOption
  | EffectScatterSeriesOption
  // unite LeafletComponentOption with the initial options of Leaflet `MapOptions`
> &
  LeafletComponentOption<MapOptions>;

// register renderers, components and charts
use([
  CanvasRenderer,
  TooltipComponent,
  LeafletComponent,
  VisualMapComponent,
  ScatterChart,
  EffectScatterChart,
  HeatmapChart,
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
  visualMap: {
    show: true, // or false if you do not want to show it
    left: 20,
    min: 0,
    max: 5,
    seriesIndex: 2,
    calculable: true,
    inRange: {
      color: ["blue", "blue", "green", "yellow", "red"],
    },
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
    {
      // TODO: figure out why heatmap is not registered
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type: "heatmap",
      // use `lmap` as the coordinate system
      coordinateSystem: "lmap",
      // data items [[lng, lat, value], [lng, lat, value], ...]
      data: [
        [12, 60, 8],
        [12.1, 60, 20],
      ],
      //pointSize: 5,
      //blurSize: 6,
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
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
  }
).addTo(lmap);
