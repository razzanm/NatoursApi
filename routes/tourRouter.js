const express = require('express');
const tourController = require('../controllers/tourControllers');

const router = express.Router();
//router.param('id', tourController.checkid);

router
  .route('/top-5-cheaptour')
  .get(tourController.topfivecheaptours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
//.post(tourController.checkbody,tourController.createTour); chaining of middlewareFunctions

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
