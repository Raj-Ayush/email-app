const express = require('express');
const { syncEmailsController, getEmailsControlller } = require('../controllers/emailController');

const router = express.Router();

router.post('/sync', syncEmailsController);
router.get('/emails', getEmailsControlller);

module.exports = router;
