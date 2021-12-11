import { util as zrUtil, graphic, matrix } from 'echarts/core';
import { logWarn } from './helper';
import {
  DomUtil,
  LatLng,
  Layer,
  Map as LMap,
  Projection,
  tileLayer,
  } from 'leaflet';


function dataToCoordSize(dataSize, dataItem) {
  dataItem = dataItem || [0, 0];
  return zrUtil.map(
    [0, 1],
    function(dimIdx) {
      const val = dataItem[dimIdx];
      const halfSize = dataSize[dimIdx] / 2;
      const p1 = [];
      const p2 = [];
      p1[dimIdx] = val - halfSize;
      p2[dimIdx] = val + halfSize;
      p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
      return Math.abs(
        this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]
      );
    },
    this
  );
}

// exclude private and unsupported options
const excludedOptions = [
  'echartsLayerInteractive',
  'renderOnMoving',
  'largeMode',
  'layers'
];

const CustomOverlay = Layer.extend({
  initialize: function(container) {
    this._container = container;
  },

  onAdd: function(map) {
    let pane = map.getPane(this.options.pane);
    pane.appendChild(this._container);

    // Calculate initial position of container with
    // `L.Map.latLngToLayerPoint()`, `getPixelOrigin()
    // and/or `getPixelBounds()`

    // L.DomUtil.setPosition(this._container, point);

    // Add and position children elements if needed

    // map.on('zoomend viewreset', this._update, this);
  },

  onRemove: function(map) {
    DomUtil.remove(this._container);
  },

  _update: function() {
    // Recalculate position of container
    // L.DomUtil.setPosition(this._container, point);
    // Add/remove/reposition children elements if needed
  },
});


function LeafletCoordSys(lmap, api) {
  this._lmap = lmap;
  this._api = api;
  this._mapOffset = [0, 0];
  this._projection = Projection.Mercator;
  // this.dimensions = ['lat', 'lng']
}

const LeafletCoordSysProto = LeafletCoordSys.prototype;

LeafletCoordSysProto.setZoom = function(zoom) {
  this._zoom = zoom;
};

LeafletCoordSysProto.setCenter = function(center) {
  this._center = this._projection.project(new LatLng(center[0], center[1]));
};

LeafletCoordSysProto.setMapOffset = function(mapOffset) {
  this._mapOffset = mapOffset;
};

LeafletCoordSysProto.setLeaflet = function(lmap) {
  this._lmap = lmap;
};

LeafletCoordSysProto.getLeaflet = function() {
  return this._lmap;
};

LeafletCoordSysProto.dataToPoint = function(data) {
  const latlng = new LatLng(data[0], data[1]);
  const px = this._lmap.latLngToLayerPoint(latlng);
  const mapOffset = this._mapOffset;
  return [px.x - mapOffset[0], px.y - mapOffset[1]];
};

LeafletCoordSysProto.pointToData = function(pt) {
  const mapOffset = this._mapOffset;
  const coord = this._lmap.layerPointToLatLng({
      x: pt[0] + mapOffset[0],
      y: pt[1] + mapOffset[1]
    }
  );
  return [coord.lat, coord.lng];
};

LeafletCoordSysProto.getViewRect = function() {
  const api = this._api;
  return new graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

LeafletCoordSysProto.getRoamTransform = function() {
  return matrix.create();
};

LeafletCoordSysProto.prepareCustoms = function() {
  return {
    coordSys: {
      // The name exposed to user is always 'cartesian2d' but not 'grid'.
      type: 'lmap',
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    api: {
      coord: zrUtil.bind(this.dataToPoint, this),
      size: zrUtil.bind(dataToCoordSize, this)
    }
  };
};

LeafletCoordSys.create = function(ecModel, api) {
  let lmapCoordSys;

  ecModel.eachComponent('lmap', function(lmapModel) {
    if (typeof L === 'undefined') {
      throw new Error('Leaflet api is not loaded');
    }
    if (lmapCoordSys) {
      throw new Error('Only one lmap echarts component can exist');
    }

    let lmap = lmapModel.getLeaflet();
    const echartsLayerInteractive = lmapModel.get('echartsLayerInteractive');
    if (!lmap) {
      const root = api.getDom();
      const painter = api.getZr().painter;
      let viewportRoot = painter.getViewportRoot();
      viewportRoot.className = 'lmap-ec-layer';
      // Not support IE8
      let lmapRoot = root.querySelector('.ec-extension-leaflet');
      if (lmapRoot) {
        // Reset viewport left and top, which will be changed
        // in moving handler in Leaflet View
        viewportRoot.style.left = '0px';
        viewportRoot.style.top = '0px';
        root.removeChild(lmapRoot);
      }
      lmapRoot = document.createElement('div');
      lmapRoot.classList.add('ec-extension-leaflet');
      lmapRoot.style.cssText = 'position:absolute;top:0;left:0;bottom:0;right:0;';
      root.appendChild(lmapRoot);

      const options = zrUtil.clone(lmapModel.get());

      // delete excluded options
      zrUtil.each(excludedOptions, function(key) {
        delete options[key];
      });

      lmap = new LMap(lmapRoot, options);

      // DEFER: adding baselayers and tilelayers and controls as part of options
      const baseLayer1 = tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
          'Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, Esri'
        }
      );
      lmap.addLayer(baseLayer1);

      /*
       Encapsulate viewportRoot element into
       the parent element responsible for moving,
       avoiding direct manipulation of viewportRoot elements
       affecting related attributes such as offset.
      */
      let moveContainer = document.createElement('div');
      moveContainer.style = 'position: relative;';
      moveContainer.appendChild(viewportRoot);

      new CustomOverlay(moveContainer).addTo(lmap);

      lmapModel.setLeaflet(lmap);
      lmapModel.setEChartsLayer(viewportRoot);

    }

    const oldEChartsLayerInteractive = lmapModel.__echartsLayerInteractive;
    if (oldEChartsLayerInteractive !== echartsLayerInteractive) {
      lmapModel.setEChartsLayerInteractive(echartsLayerInteractive);
      lmapModel.__echartsLayerInteractive = echartsLayerInteractive;
    }

    const center = lmapModel.get('center');
    const zoom = lmapModel.get('zoom');
    if (center && zoom) {
      const lmapCenter = lmap.getCenter();
      const lmapZoom = lmap.getZoom();
      const centerOrZoomChanged = lmapModel.centerOrZoomChanged(
        [lmapCenter.lat, lmapCenter.lng],
        lmapZoom
      );
      if (centerOrZoomChanged) {
        lmap.setView(new LatLng(center[0], center[1]), zoom);
      }
    }

    lmapCoordSys = new LeafletCoordSys(lmap, api);
    lmapCoordSys.setMapOffset(lmapModel.__mapOffset || [0, 0]);
    lmapCoordSys.setZoom(zoom);
    lmapCoordSys.setCenter(center);

    lmapModel.coordinateSystem = lmapCoordSys;
  });

  ecModel.eachSeries(function(seriesModel) {
    if (seriesModel.get('coordinateSystem') === 'lmap') {
      seriesModel.coordinateSystem = lmapCoordSys;
    }
  });
};

LeafletCoordSysProto.dimensions = LeafletCoordSys.dimensions = ['lat', 'lng'];

export default LeafletCoordSys;
