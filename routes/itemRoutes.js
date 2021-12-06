const express = require('express');
const itemController = require('./../controllers/itemController');
const authController = require('./../controllers/authController');
const searchController = require('./../controllers/searchController');

const router = express.Router();

// router.param('id', itemController.checkID);

router.route('/search').get(searchController.itemSearch);

router
  .route('/')
  .get(authController.protect, itemController.getAllItems)
  .post(
    authController.protect,
    itemController.uploadItemImages,
    itemController.resizeItemImages,
    itemController.createItem
  );

router
  .route('/:id')
  .get(authController.protect, itemController.getItem)
  .patch(authController.protect, itemController.updateItem)
  .delete(authController.protect, itemController.deleteItem);

module.exports = router;
