import mongoose from "mongoose";
import validator from "validator";

const queueSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: "Shop",
      required: [true, "A Queue must have a Shop"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    number: {
      type: Number,
      default: 0,
    },
    service: {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
    },
    status: {
      type: String,
      default: "Waiting",
      enum: ["Accepted", "Rejected", "Cancelled", "Waiting", "Over"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;
