import crypto from "crypto";
import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: [true, "This email is already registered"],
      lowercase: true,
      validate: [isEmail, "Please provide a valid email"],
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    // FOR ADMIN USERS WHO HAS SHOP
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: "Shops",
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function () {
          return "admin" === this.role;
        },
        message: "Need admin account to link shop",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    notifications: [
      {
        shop: String,
        service: String,
        status: String,
        number: Number,
        createdAt: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// userSchema.index({ email: 1 }, { unique: true });
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// VIRTUAL FIEL WHICH WILL STORE ALL TICKETS USER HAS GENERATED
userSchema.virtual("queueList", {
  ref: "Queue",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// COMPARE PASSWORD IF IT IS CORRECT OR NOT
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// CHECK IF PASSWORD IS CHANGED AFTER THE TIME STAMP
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.virtual("queue", {
  ref: "Queue",
  foreignField: "user",
  localField: "_id",
});

const User = mongoose.model("User", userSchema);
export default User;
