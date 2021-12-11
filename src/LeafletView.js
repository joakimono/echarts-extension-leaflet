import { ComponentView, getInstanceByDom, throttle } from 'echarts/core';
import { clearLogMap } from './helper';

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
      let mapOffset = [dx, dy];
      moveContainer.style.left = `${mapOffset[0]}px`;
      moveContainer.style.top = `${mapOffset[1]}px`;

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

    lmap.off('move', this._moveHandler);
    lmap.off('moveend', this._moveHandler);
    lmap.off('viewreset', this._moveHandler);
    lmap.off('zoom', this._moveHandler);
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
      lmap.off('movestart', this._moveStartHandler);
    }
    if (this._moveEndHandler) {
      lmap.off('moveend', this._moveEndHandler);
      lmap.off('zoomend', this._moveEndHandler);
    }

    lmap.on(
      renderOnMoving ? 'move' : 'moveend',
      (largeMode) ? (moveHandler = throttle(moveHandler, 20, true)) : moveHandler
    );

    lmap.on('keydown', ctrlStartHandler);
    lmap.on('keyup', ctrlEndHandler);

    this._ctrlStartHandler = ctrlStartHandler;
    this._ctrlEndHandler = ctrlEndHandler;

    this._moveHandler = moveHandler;

    if (renderOnMoving) {
      // need to listen to zoom?
      // FIXME: unnecessary `move` event triggered when zooming?
      lmap.on('zoom', moveHandler);
    }

    if (!renderOnMoving) {
      lmap.on('movestart', this._moveStartHandler = function() {
        setTimeout(function() {
          lmapModel.setEChartsLayerVisiblity(false);
        }, 0);
      });
      const moveEndHandler = this._moveEndHandler = function(e) {
        ;(!e || e.type !== 'moveend') && moveHandler(e);
        setTimeout(function() {
          lmapModel.setEChartsLayerVisiblity(true);
        }, !largeMode ? 0 : 20);
      };
      lmap.on('moveend', moveEndHandler);
      lmap.on('zoomend', moveEndHandler);
    }

    if (resizeEnable) {
      let resizeHandler = function() {
        getInstanceByDom(api.getDom()).resize();
      };
      if (largeMode) {
        resizeHandler = throttle(resizeHandler, 20, true);
      }
      lmap.on('resize', this._resizeHandler = resizeHandler);
    }

    this._isFirstRender = rendering = false;
  },

  dispose(ecModel) {
    clearLogMap();
    const component = ecModel.getComponent('lmap');
    if (component) {
      component.getLeaflet().off();
      component.getLeaflet().remove();
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

export default ComponentView.extend(LeafletView);
