import { asyncMiddleware } from '../utils/async_middleware';
import validator from '../controllers/validator';
import * as place from './validators/place';
import * as placeLinkage from './validators/place_linkage';
import { Router } from 'restify-router';
import * as placeController from '../controllers/place_controller';
import * as placeLinkageController from '../controllers/place_linkage_controller';

const router = new Router();
// Parent route: /place/

router.post('/', validator(place.create), asyncMiddleware(placeController.create));
router.get('/', asyncMiddleware(placeController.list));
router.get('/:id', asyncMiddleware(placeController.get));
router.get('/:id/linkage', asyncMiddleware(placeController.getLinkage));

router.post('/linkage/', validator(placeLinkage.create), asyncMiddleware(placeLinkageController.createLinkage));
router.get('/linkage/:id', asyncMiddleware(placeLinkageController.get));

export default router;
