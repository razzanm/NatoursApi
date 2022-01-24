const express = require('express');
const userController = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.post('/signup', authControllers.signup);
router
  .route('/')
  .get(userController.getAllusers)
  .post(userController.createUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
