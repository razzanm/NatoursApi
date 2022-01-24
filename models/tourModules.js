const mongoose = require('mongoose');
//const validator = require('validator');

//creating the database schema
const tourSchema = new mongoose.Schema({
  name: {
    //passing the options to the name field
    type: String, // this represents the type of data to be stored in
    required: [true, 'A tour mus have a name'], // this represents that the name field must be there
    unique: [true, 'A tour mus have a unique name'], //this represents that the name field must be unique
    trim: true, 
    maxLength:[40,"A tour must have less than 40 characters"],
    minLength:[10,"A tour must have at least 10 characters"],
    //validate: [validator.isAlpha,'Tour Name must only contain alpha characters']
  },
  duration: {
    type: Number,
    required: [true, 'A tour mus have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour mus have a max group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour mus have a difficulty'],// this is the shorthand representation for the below enum format
    enum:{
        values: ['easy','medium','difficult'],
        message:'Difficulty is either : easy, medium, or difficult'
    }
  },
  //rating:Number we can also pass the field like this to
  ratingsAverage: {
    type: Number,
    default: 4.5, // this represents that if the rating field is not there then it will be automatically added 4.5
    min:[1,'Rating Must be above one'],
    max:[5,'Rating Must be less than or equal to five'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: {
      type: Number,
    //   validate: function(val){
    //       return val < this.price;
    //   }
    validate:{
        // these function  does not work on update 
        // it works for new document creations
        validator: function(val){
            return val < this.price
        },
        message:'A discount must be less than or equal to price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have image'],
  },
  images: [String], //it represents the array of strings
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
  price: {
    type: Number,
    required: [true, 'A tour Must have a price'], // if the price field is empty then this message will be displayed
  },
  slug:String,
  secretTour:{
      type:Boolean,
      default: false,
  },
},{
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
});

//adding the virtual properties to schema object
//this will not get stored in the database

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Document Middleware: runs when .save() or  .create() is called

// tourSchema.pre('save', function (next) {
//     this.slug = this.name.toLowerCase();
//     next();
// })

// tourSchema.post('save', (docs,next) => {
//     console.log(docs);
//     next();
// });

//Query Middleware
tourSchema.pre(/^find/, function (next) {
    this.find({secretTour:{$ne: true}});
    this.start = Date.now();
    next();
})

tourSchema.post(/^find/, function (docs,next) {
    console.log(`Time taken by query is${Date.now() - this.start}`);
   // console.log(docs);
    next();
})

tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne: true}}});
    console.log(this.pipeline());
    next();
})

// create the Model Using Above Schema

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
