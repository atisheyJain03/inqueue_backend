import mongoose from "mongoose";
// import slugify from 'slugify';
// const User = require('./userModel');
// const validator = require('validator');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "A Shop must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A Shop name must have less or equal then 40 characters"],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    info: {
      type: String,
      trim: true,
      // required: [true, "A shop must have a info"],
    },
    description: {
      type: String,
      trim: true,
    },
    coverPhoto: {
      type: String,
    },
    cardPhoto: String,
    // createdAt: {
    //   type: Date,
    //   default: Date.now(),
    //   select: false
    // },
    openingHours: [
      {
        open: Number,
        close: Number,
      },
    ],
    Location: {
      // GeoJSON
      required: false,
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    // serviceBy: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Service'
    //   }
    // ],
    address: {
      type: String,
      // required: [true, "A Shop must have a valid address"],
    },
    AverageWaitTime: {
      type: Number,
      default: 0,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    shopType: {
      type: String,
      // required: [
      //   true,
      //   "A Shop must have a Type i.e a profession e.g. Car Shop , Hospital ,etc",
      // ],
      // default: "Temp",
    },
    phoneNumber: Number,
    website: String,
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
// tourSchema.index({ price: 1, ratingsAverage: -1 });
// tourSchema.index({ slug: 1 });
shopSchema.index({ Location: "2dsphere" });

// tourSchema.virtual('durationWeeks').get(function() {
//   return this.duration / 7;
// });

// Virtual populate
shopSchema.virtual("serviceBy", {
  ref: "Service",
  foreignField: "shop",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// tourSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// // QUERY MIDDLEWARE
// // tourSchema.pre('find', function(next) {
// tourSchema.pre(/^find/, function(next) {
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();
//   next();
// });

// tourSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'guides',
//     select: '-__v -passwordChangedAt'
//   });

//   next();
// });

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
