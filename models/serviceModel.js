import mongoose from "mongoose";
import validator from "validator";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: "Shop",
    },
    currentNumber: {
      type: Number,
      default: 0,
    },
    totalNumber: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    waitingTime: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

serviceSchema.virtual("queue", {
  ref: "Queue",
  foreignField: "service",
  localField: "_id",
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;
