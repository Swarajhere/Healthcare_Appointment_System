const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users', userController.getAllUsers);
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.get('/getuser/id/:userId', userController.getUserById);
router.get('/getuser/email/:email', userController.getUserByEmail);
router.get('/getusers', userController.getAllUsers);
router.get('/getusers/role/:role', userController.getUsersByRole);


module.exports = router;
