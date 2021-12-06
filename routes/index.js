const express = require('express');
const router = express.Router();
// const homeController = require('../controllers/home');
const uploadController = require('../controllers/upload');

router.route('/upload').post(uploadController.uploadFiles);
router.route('/files').get(uploadController.getListFiles);
router.route('/files/:name').get(uploadController.download);

module.exports = router;
