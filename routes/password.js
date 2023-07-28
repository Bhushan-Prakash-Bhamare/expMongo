const express = require('express');
const passwordController = require('../controllers/password');

const router = express.Router();
  
router.post('/forgotpassword',passwordController.passwordresetmail); 

router.get('/resetpassword',passwordController.passwordreset);

router.post('/change',passwordController.passwordupdate);

module.exports = router; 
