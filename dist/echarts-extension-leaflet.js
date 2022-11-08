(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("echarts/core"), require("leaflet"));
	else if(typeof define === 'function' && define.amd)
		define(["echarts/core", "leaflet"], factory);
	else if(typeof exports === 'object')
		exports["echartsExtensionLeaflet"] = factory(require("echarts/core"), require("leaflet"));
	else
		root["echartsExtensionLeaflet"] = factory(root["echarts"], root["L"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__792__, __WEBPACK_EXTERNAL_MODULE__303__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 792:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__792__;

/***/ }),

/***/ 303:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__303__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external {"commonjs":"echarts/core","commonjs2":"echarts/core","amd":"echarts/core","root":"echarts"}
var core_root_echarts_ = __webpack_require__(792);
;// CONCATENATED MODULE: ./src/helper.js
 //lib/echarts";

const ecVer = core_root_echarts_.version.split('.');

function v2Equal(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

let logMap = {};

function logWarn(tag, msg, once) {
  const log = `[ECharts][Extension][Leaflet]${tag ? ' ' + tag + ':' : ''} ${msg}`;
  once && logMap[log] || console.warn(log);
  once && (logMap[log] = true);
}

function clearLogMap() {
  logMap = {};
}

// EXTERNAL MODULE: external {"commonjs":"leaflet","commonjs2":"leaflet","amd":"leaflet","root":"L"}
var external_commonjs_leaflet_commonjs2_leaflet_amd_leaflet_root_L_ = __webpack_require__(303);
;// CONCATENATED MODULE: ./src/LeafletCoordSys.js





function dataToCoordSize(dataSize, dataItem) {
  dataItem = dataItem || [0, 0];
  return core_root_echarts_.util.map(
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

const CustomOverlay = external_commonjs_leaflet_commonjs2_leaflet_amd_leaflet_root_L_.Layer.extend({
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
    external_commonjs_leaflet_commonjs2_leaflet_amd_leaflet_root_L_.DomUtil.remove(this._container);
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
  this._projection = external_commonjs_leaflet_commonjs2_leaflet_amd_leaflet_root_L_.Projection.Mercator;
  // this.dimensions = ['lat', 'lng'] // Is Leaflet default, but incompatible with echarts heatmap since isGeoCoordSys in HeatMapView.ts, checks for [0] === 'lng', [1] === 'lat'
}

const LeafletCoordSysProto = LeafletCoordSys.prototype;

LeafletCoordSysProto.setZoom = function(zoom) {
  this._zoom = zoom;
};

LeafletCoordSysProto.setCenter = function(center) {
  const latlng = this._projection.project(new external_commonjs_leaflet_commonjs2_leaflet_amd_leaflet_root_L_.LatLng(center[1], center[0])); // lng, lat
  this._center = [latlng.lng, latlng.lat];
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
  const latlng = new external_commonjs_leaflet_commonjs2_leaflet_amd_leaflet_root_L_.LatLng(data[1], data[0]); // lng, lat
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
  return [coord.lng, coord.lat]; // lng, lat
};

LeafletCoordSysProto.getViewRect = function() {
  const api = this._api;
  return new core_root_echarts_.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

LeafletCoordSysProto.getRoamTransform = function() {
  return core_root_echarts_.matrix.create();
};

LeafletCoordSysProto.prepareCustoms = function() {
  const rect = this.getViewRect();
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
      coord: core_root_echarts_.util.bind(this.dataToPoint, this),
      size: core_root_echarts_.util.bind(dataToCoordSize, this)
    }
  };
};

LeafletCoordSysProto.convertToPixel = function(ecModel, finder, value) {
  // here we don't use finder as only one amap component is allowed
  return this.dataToPoint(value);
};

LeafletCoordSysProto.convertFromPixel = function(ecModel, finder, value) {
  // here we don't use finder as only one amap component is allowed
  return this.pointToData(value);
};


LeafletCoordSys.create = function(ecModel, api) {
  let lmapCoordSys;

  ecModel.eachComponent('lmap', function(lmapModel) {

    if (typeof L === 'undefined') {
      throw new Error('Leaflet api is not loaded');
    }
    if (lmapCoordSys) {
      throw new Error('Only one lmap echarts component is allowed');
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
      lmapRoot.className =  'ec-extension-leaflet';
      lmapRoot.style.cssText = 'position:absolute;top:0;left:0;bottom:0;right:0;';
      root.appendChild(lmapRoot);

      const options = core_root_echarts_.util.clone(lmapModel.get());

      // delete excluded options
      core_root_echarts_.util.each(excludedOptions, function(key) {
        delete options[key];
      });

      lmap = new external_commonjs_leaflet_commonjs2_leaflet_amd_leaflet_root_L_.Map(lmapRoot, options);

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
      const lmapCenter = lmap.getCenter(); // leaflet lat lng
      const lmapZoom = lmap.getZoom();
      const centerOrZoomChanged = lmapModel.centerOrZoomChanged(
        [lmapCenter.lng, lmapCenter.lat], // lng, lat
        lmapZoom
      );
      if (centerOrZoomChanged) {
        lmap.setView(new external_commonjs_leaflet_commonjs2_leaflet_amd_leaflet_root_L_.LatLng(center[1], center[0]), zoom); // lng, lat
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

  return lmapCoordSys && [lmapCoordSys];
};

LeafletCoordSysProto.dimensions = LeafletCoordSys.dimensions = ['lng', 'lat']; // lng, lat

LeafletCoordSysProto.type = "lmap";

/* harmony default export */ const src_LeafletCoordSys = (LeafletCoordSys);

;// CONCATENATED MODULE: ./src/LeafletModel.js



const LeafletModel = {
  type: 'lmap',

  setLeaflet(lmap) {
    this.__lmap = lmap;
  },

  getLeaflet() {
    return this.__lmap;
  },

  getId() {
    return this.__lmap._leaflet_id;
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
    // center received here is in lat, lng, so swap it
    this.option.center = [center[1], center[0]];
    this.option.zoom = zoom;
  },

  centerOrZoomChanged(center, zoom) {
    const option = this.option;
    return !(v2Equal(center, option.center) && zoom === option.zoom);
  },

  defaultOption: {
    center: [10.39506, 63.43049], // lng, lat
    zoom: 6,
    // extension specific options
    echartsLayerInteractive: true,
    renderOnMoving: true,
    largeMode: false
  }
};

/* harmony default export */ const src_LeafletModel = (core_root_echarts_.ComponentModel.extend(LeafletModel));

;// CONCATENATED MODULE: ./src/LeafletView.js



const LeafletView = {
  type: 'lmap',

  init() {
    this._isFirstRender = true;
  },

  render(lmapModel, ecModel, api) {
    let rendering = true;

    const lmap = lmapModel.getLeaflet();
    const moveContainer = api.getZr().painter.getViewportRoot().parentNode;
    const coordSys = lmapModel.coordinateSystem;
    const offsetEl = lmap._mapPane;

    const renderOnMoving = lmapModel.get('renderOnMoving');
    const resizeEnable = lmapModel.get('resizeEnable');
    const largeMode = lmapModel.get('largeMode');

    let moveHandler = function(e) {
      if (rendering) {
        return;
      }
      let transformStyle = offsetEl.style.transform;
      let dx = 0;
      let dy = 0;
      if (transformStyle) {
        transformStyle = transformStyle.replace('translate3d(', '');
        let parts = transformStyle.split(',');
        dx = -parseInt(parts[0], 10);
        dy = -parseInt(parts[1], 10);
      } else {
        // browsers that don't support transform: matrix
        dx = -parseInt(offsetEl.style.left, 10);
        dy = -parseInt(offsetEl.style.top, 10);
      }

      const mapOffset = [dx, dy];
      const offsetLeft = mapOffset[0] + 'px';
      const offsetTop = mapOffset[1] + 'px';
      if (moveContainer.style.left !== offsetLeft) {
        moveContainer.style.left = offsetLeft;
      }
      if (moveContainer.style.top !== offsetTop) {
        moveContainer.style.top = offsetTop;
      }

      coordSys.setMapOffset(lmapModel.__mapOffset = mapOffset);

      const actionParams = {
        type: 'lmapRoam',
        animation: {
          // compatible with ECharts 5.x
          // no delay for rendering but remain animation of elements
          duration: 0
        }
      };

      api.dispatchAction(actionParams);
    };

    if(largeMode) {
      moveHandler = (0,core_root_echarts_.throttle)(moveHandler, 20, true);
    }

    if(this._isFirstRender){
      this._moveHandler = moveHandler;
    }

    let ctrlStartHandler = function(e) {
      if(e.originalEvent.code === 'ControlLeft') {
      lmap.dragging.disable();
      moveHandler(e);
      }
    };

    let ctrlEndHandler = function(e) {
      if(e.originalEvent.code === 'ControlLeft') {
        lmap.dragging.enable();
      }
    };

    this._ctrlStartHandler = ctrlStartHandler;
    this._ctrlEndHandler = ctrlEndHandler;

    lmap.off('move', this._moveHandler);
    lmap.off('moveend', this._moveHandler);
    lmap.off('zoom', this._moveHandler);
    lmap.off('viewreset', this._moveHandler);
    lmap.off('zoomend', this._moveHandler);
    lmap.off('keydown', this._ctrlStartHandler);
    lmap.off('keyup', this._ctrlEndHandler);

    if(this._ctrlStartHandler) {
      lmap.off('keydown', this._ctrlStartHandler);
    }

    if(this._ctrlEndHandler) {
      lmap.off('keyup', this._ctrlEndHandler);
    }

    if (this._resizeHandler) {
      lmap.off('resize', this._resizeHandler);
    }
    if (this._moveStartHandler) {
      lmap.off('move', this._moveStartHandler);
      lmap.off('zoomstart', this._moveStartHandler);
      lmap.off('zoom', this._moveStartHandler);
    }

    lmap.on(renderOnMoving ? 'move' : 'moveend', moveHandler);
    lmap.on(renderOnMoving ? 'zoom' : 'zoomend', moveHandler);

    if(renderOnMoving){
      lmap.on('viewreset', moveHandler); // needed?
    }

    if(!renderOnMoving && !this._moveEndHandler) {
      const moveEndHandler = function(e) {
        setTimeout(function() {
          lmapModel.setEChartsLayerVisiblity(true);
        }, !largeMode ? 0 : 20);
      };
      this._moveEndHandler = moveEndHandler;
      lmap.on('moveend', moveEndHandler);
      lmap.on('zoomend', moveEndHandler);
    }

    lmap.on('keydown', ctrlStartHandler);
    lmap.on('keyup', ctrlEndHandler);

    this._moveHandler = moveHandler;

    if (!renderOnMoving) {
      const moveStartHandler = function() {
        lmapModel.setEChartsLayerVisiblity(false);
        setTimeout(function() {
          lmapModel.setEChartsLayerVisiblity(true);
        }, 500);
      };
      this._moveStartHandler = moveStartHandler;
      lmap.on('move', moveStartHandler); // hide when move occurs
      lmap.on('zoomstart', moveStartHandler); // hide when zoom starts
      lmap.on('zoom', moveStartHandler); // hide when zoom occurs
    }

    if (resizeEnable) {
      let resizeHandler = function() {
        (0,core_root_echarts_.getInstanceByDom)(api.getDom()).resize();
      };
      if (largeMode) {
        resizeHandler = (0,core_root_echarts_.throttle)(resizeHandler, 20, true);
      }
      this._resizeHandler = resizeHandler;
      lmap.on('resize', resizeHandler);
    }

    this._isFirstRender = rendering = false;
  },

  dispose() {
    clearLogMap();
    const component = this.__model;
    if (component) {
      const leaflet = component.getLeaflet();
      if(leaflet){
        component.getLeaflet().off();
        component.getLeaflet().remove();
      }
      component.setLeaflet(null);
      component.setEChartsLayer(null);
      if (component.coordinateSystem) {
        component.coordinateSystem.setLeaflet(null);
        component.coordinateSystem = null;
      }
      delete this._moveHandler;
      delete this._resizeHandler;
      delete this._moveStartHandler;
      delete this._moveEndHandler;
      delete this._ctrlEndHandler;
      delete this._ctrlStartHandler;
    }
  }
};

/* harmony default export */ const src_LeafletView = (core_root_echarts_.ComponentView.extend(LeafletView));

;// CONCATENATED MODULE: ./src/lmap.js
/**
 * Leaflet component extension
 */







function install(registers) {

  // add coordinate system support for pie series for ECharts < 5.4.0
  if ((ecVer[0] == 5 && ecVer[1] < 4)) {
    registers.registerLayout(function(ecModel, api) {
      ecModel.eachSeriesByType('pie', function (seriesModel) {
        const coordSys = seriesModel.coordinateSystem;
        const data = seriesModel.getData();
        const valueDim = data.mapDimension('value');
        if (coordSys && coordSys.type === 'lmap') {
          const center = seriesModel.get('center');
          const point = coordSys.dataToPoint(center);
          const cx = point[0];
          const cy = point[1];
          data.each(valueDim, function (value, idx) {
            const layout = data.getItemLayout(idx);
            layout.cx = cx;
            layout.cy = cy;
          });
        }
      });
    });
  }

  registers.registerComponentModel(src_LeafletModel);
  registers.registerComponentView(src_LeafletView);
  registers.registerCoordinateSystem('lmap', src_LeafletCoordSys);

  // Action
  registers.registerAction(
    {
      type: 'lmapRoam',
      event: 'lmapRoam',
      update: 'updateLayout'
    },
    function(payload, ecModel) {
      ecModel.eachComponent('lmap', function(lmapModel) {
        const lmap = lmapModel.getLeaflet();
        const center = lmap.getCenter();
        lmapModel.setCenterAndZoom([center.lat, center.lng], lmap.getZoom());
      });
    }
  );
}



;// CONCATENATED MODULE: ./src/index.js



(0,core_root_echarts_.use)(install);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});