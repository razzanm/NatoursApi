const Tour = require('../models/tourModules');
const TourGetFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// writing to files i
// fs.writeFile(
//   `${__dirname}/dev-data/data/tours-simple.json`,
//   JSON.stringify(tours),
//   (err) => {
//     res.status(201).json({ status: 'success', data: { tour: newTour } });
//   }
// );
// exports.checkid = (req, res, next, val) => {
//   //console.log(req);
//   if (val > tours.length) {
//     res.status(404).json({ status: 'fail', message: 'invalid id' });
//     return;
//   }
//   next();
// };

// i dont know how this works but it works
//these functons are used and parameterized middle wares
//i Think the default value passed here is the body of request object

// exports.checkbody = (req, res, next, val) => {
//    if(val.name === null || val.price === null){
//      return res.status(404).json({ status: 'fail', message: 'Invalid post request'});
//    }
//    next();
// }

//instead of this above function we should write the middle ware in simple way instead
// exports.checkbody = (req, res, next) => {
//   console.log(req.body.price);
//   console.log(req.body.name);
//   if (req.body.name) {
//     return res
//       .status(404)
//       .json({ status: 'fail', message: 'Invalid post request' });
//   }
//   next();
// };
exports.topfivecheaptours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary';
  next();
};

exports.createTour = catchAsync(async (req, res, next) => {
  // const tour = new Tour({});
  // tour.save();
  //instead of this we can simply create doc by using create function
  //try {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
  // } catch (e) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: e.message,
  //   });
  // }

  // console.log(req);
  // const newid = tours[tours.length - 1].id + 1;
  // // eslint-disable-next-line node/no-unsupported-features/es-syntax
  // const newTour = { id: newid, ...req.body };
  // tours.push(newTour);
});
exports.getAllTours = catchAsync(async (req, res, next) => {
  //try {
  // console.log(req.query);
  //filtering query
  // const queryObj = {...req.query};
  // const execuleFields = ['page', 'sort','limit','fields'];
  // execuleFields.forEach(el => delete queryObj[el]);
  // //advance filterings
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
  // console.log(queryStr);

  // //declare query
  // let query =Tour.find(JSON.parse(queryStr));
  //sorting the query
  // if (req.query.sort) {
  //   const sortby = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortby);
  // } else {
  //   query = query.sort('-createdAt');
  // }
  //sending the require field only
  // if (req.query.fields) {
  //   const filterby = req.query.fields.split(',').join(' ');
  //   query = query.select(filterby);
  // } else {
  //   query = query.select('-__v');
  // }

  // paginations
  // if (req.query.page && req.query.limit) {
  //   const page = req.query.page * 1 || 1;
  //   const limit = req.query.limit * 1 || 100;
  //   const skip = (page - 1) * limit;

  //   query = query.skip(skip).limit(limit);

  //   const numoftours = await Tour.countDocuments();
  //   if (skip >= numoftours) throw new Error('The page does not exist');
  // }
  //
  // if (req.query.limit) {
  //   const limited = req.query.limit * 1;
  //   query.limit(limited);
  // }
  //Execute the query
  //const tours = await query;
  //{ duration:5,difficulty:'easy'}

  //speecial mongoose functions
  // const tours = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  // After putting all these features into the the class

  const features = new TourGetFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginations(Tour.countDocuments())
    .getlimiteddata();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    RequestedTime: req.requesttime,
    result: tours.length,
    data: {
      tours,
    },
  });
  // } catch (e) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: e.message,
  //   });
  // }
});

exports.getTour = catchAsync(async (req, res, next) => {
  // try {
  //const tour = await Tour.findOne({"_id": req.params.id});
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('Data not fount', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // } catch (e) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: e.message,
  //   });
  // }
  // console.log(req.params.id);
  // //console.log(tours);
  // const idd = req.params.id * 1;

  // const tour = tours.find((el) => el.id === idd);
  // console.log(`This is tour val:${tour}`);
});

exports.updateTour = catchAsync(async (req, res, next) => {
  // try {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('Data not fount', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // } catch (e) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: e.message,
  //   });
  // }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  // try {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('Data not fount', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
  // } catch (e) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: e.message,
  //   });
  // }
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  //try {
  const stats = await Tour.aggregate([
    {
      $match: {
        $and: [{ ratingsAverage: { $gte: 4.5 } }, { price: { $gt: 500 } }],
      },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $match: { _id: 'difficult' },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // } catch (e) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: e.message,
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' }, // unwind creats a seperate document for each element in the array
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { month: 1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  // } catch (e) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: e.message,
  //   });
  // }
});
