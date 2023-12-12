const express = require('express');
const multer = require('multer');
const authentication = require('../middlewares/authentication.js');
const addItemService = require('../controllers/addItem.service.js');
const getItemService = require('../controllers/getItem.service.js');
const getMyItemsService = require('../controllers/getMyItems.service.js');
const getOtherItems = require('../controllers/getOtherItems.service.js');
const searchItems = require('../controllers/searchItem.service.js');
const updateMyItemService = require('../controllers/updateMyItem.service.js');
const deleteMyItemService = require('../controllers/deleteMyItem.service.js');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', authentication, upload.array('photos', 5), addItemService);
router.get('/', authentication, getItemService);
router.get('/me', authentication, getMyItemsService);
router.get('/other', authentication, getOtherItems);
router.get('/search', authentication, searchItems);
router.patch('/:id', authentication, updateMyItemService);
router.delete('/:id', authentication, deleteMyItemService);

module.exports = router;