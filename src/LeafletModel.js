import { ComponentModel } from 'echarts/core';
import { v2Equal } from './helper';

const LeafletModel = {
  type: 'lmap',

  setLeaflet(lmap) {
    this.__lmap = lmap;
  },

  getLeaflet() {
    return this.__lmap;
  },

  setEChartsLayer(layer) {
    this.__echartsLayer = layer;
  },

  getEChartsLayer() {
    return this.__echartsLayer;
  },

  setEChartsLayerVisiblity(visible) {
    this.__echartsLayer.style.display = visible ? 'block' : 'none';
  },

  // FIXME: NOT SUPPORT <= IE 10
  setEChartsLayerInteractive(interactive) {
    this.option.echartsLayerInteractive = !!interactive;
    this.__echartsLayer.style.pointerEvents = interactive ? 'auto' : 'none';
  },

  setCenterAndZoom(center, zoom) {
    this.option.center = center;
    this.option.zoom = zoom;
  },

  centerOrZoomChanged(center, zoom) {
    const option = this.option;
    return !(v2Equal(center, option.center) && zoom === option.zoom);
  },

  defaultOption: {
    center: [63.43049, 10.39506],
    zoom: 6,
    // extension specific options
    echartsLayerInteractive: true,
    renderOnMoving: true,
    largeMode: false
  }
};

export default ComponentModel.extend(LeafletModel);
