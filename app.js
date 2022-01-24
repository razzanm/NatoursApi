const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
//console.log(express);
const app = express();

app.use(morgan('dev'));

//middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//defining own middleware

// app.use((req, res, next) => {
//   console.log('my first middle ware');
//   next(); // vey very important to call the next function because other middleware will simply not get called until
// });

// we can modify req and res obj using the middleware function

app.use((req, res, next) => {
  console.log('my second middleware');
  req.requesttime = new Date().toISOString();
  next();
});
//console.log(app);

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'how are you doing man', name: 'rajan' });
// });

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

//handle get request from user
// app.get('/api/v1/tours', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     result: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

// we can handle such request using callback function

// const getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     RequestedTime: req.requesttime,
//     result: tours.length,
//     data: {
//       tours,
//     },
//   });
// };

// const getTour = (req, res) => {
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     res.status(404).json({ status: 'fail', message: 'invalid id' });
//     return;
//   }
//   const tour = tours.find((el) => el.id === id);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// const updateTour = (req, res) => {
//   res.status(200).json({ status: 'success', message: 'updated' });
// };

// const deleteTour = (req, res) => {
//   res.status(200).json({ status: 'success', message: 'deleted' });
// };

// const createTour = (req, res) => {
//   console.log(req);
//   const newid = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newid }, req.body);
//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({ status: 'success', data: { tour: newTour } });
//     }
//   );
// };

// const getAllusers = (req, res) => {
//   res
//     .status(500)
//     .json({ status: 'Internal Server Error', message: 'fixing it soon' });
// };

// const createUsers = (req, res) => {
//   res
//     .status(500)
//     .json({ status: 'Internal Server Error', message: 'fixing it soon' });
// };
// const getUser = (req, res) => {
//   res
//     .status(500)
//     .json({ status: 'Internal Server Error', message: 'fixing it soon' });
// };
// const updateUser = (req, res) => {
//   res
//     .status(500)
//     .json({ status: 'Internal Server Error', message: 'fixing it soon' });
// };
// const deleteUser = (req, res) => {
//   res
//     .status(500)
//     .json({ status: 'Internal Server Error', message: 'fixing it soon' });
// };

// app.get('/api/v1/tours',getAllTours);

// //handle request for each id
// app.get('/api/v1/tours/:id',getTour );

// //handle the pach requests from

// app.patch('/api/v1/tours/:id',updateTour );

// //handling the delete requests from the

// app.delete('/api/v1/tours/:id',deleteTour);

// //handle post request from user
// app.post('/api/v1/tours',createTour);

//we can create a new router which acts as a sub application

//const userRouter = express.Router();

//Instead of writting each poast get and update method saperetaly for each mrthod request
//we can chain them in one using the route method

//user routes are

app.use('/api/v1/tours/', tourRouter); 
app.use('/api/v1/users/', userRouter);

app.all('*', (req, res, next) => {

  const err = new AppError(`cant find url ${req.originalUrl} on this Server`,404);
  next(err);
});

//Error handling MiddleWare
app.use(globalErrorHandler);
module.exports = app;
