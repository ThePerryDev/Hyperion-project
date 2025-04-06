import { Router } from 'express';
import StacApiController from '../controllers/Stac_Api_Controller';

const router = Router();

router.get('/fetch', StacApiController.fetchAndSaveItems);
router.get('/collections', StacApiController.listSupportedCollections);
router.get('/', StacApiController.listItems);
router.get('/:id', StacApiController.getItem);
router.delete('/:id', StacApiController.deleteItem);

export default router;
