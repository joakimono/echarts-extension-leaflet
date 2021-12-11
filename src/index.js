/**
 * Leaflet component extension
 */

import LeafletCoordSys from './LeafletCoordSys';
import LeafletModel from './LeafletModel';
import LeafletView from './LeafletView';

export { version, name } from '../package.json';

function install(registers) {

  registers.registerComponentModel(LeafletModel);
  registers.registerComponentView(LeafletView);
  registers.registerCoordinateSystem('lmap', LeafletCoordSys);

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

export {install as LeafletComponent}
