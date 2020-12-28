import mongoose from "mongoose";
// import slugify from 'slugify';
// const User = require('./userModel');
import validator from "validator";

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
    openingHours: [
      {
        open: Number,
        close: Number,
      },
    ],
    // Location: {
    //   // GeoJSON
    //   required: false,
    //   type: {
    //     type: String,
    //     default: "Point",
    //     enum: ["Point"],
    //   },
    //   coordinates: [Number],
    // },
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
    phoneNumber: {
      type: Number,
      min: 1000000000,
      max: 9999999999,
    },
    website: {
      type: String,
      // validate: [validator.isUrl, "Not a valid URL"],
    },
    active: {
      type: Boolean,
      default: false,
    },
    waitingQueue: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Queue",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

shopSchema.index({ Location: "2dsphere" });

// Virtual for all services linked to shop
shopSchema.virtual("serviceBy", {
  ref: "Service",
  foreignField: "shop",
  localField: "_id",
});

// // QUERY MIDDLEWARE
// // tourSchema.pre('find', function(next) {
// tourSchema.pre(/^find/, function(next) {
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();
//   next();
// });

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
