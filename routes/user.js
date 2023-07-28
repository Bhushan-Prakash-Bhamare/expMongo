const express = require('express');
const userController = require('../controllers/user');
const userauthentication=require('../middlewares/auth');

const router = express.Router();
 
router.get('/',userauthentication.authenticate,userController.getuser);

router.post('/login',userController.login);

router.post('/signup', userController.signup);

router.get('/download',userauthentication.authenticate, userController.download);

router.get('/dhistory', userauthentication.authenticate , userController.getDownloadHistory); 

module.exports = router; 