const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      match: [/.@emory.edu/, 'Please fill a valid emory email address'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, 'Please provide your address'],
    },
    city: {
      type: String,
      required: [true, 'Please provide your city'],
    },
    state: {
      type: String,
      required: [true, 'Please provide your state'],
    },
    zipcode: {
      type: String,
      required: [true, 'Please provide your zipcode'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    favorite: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
);
// virtual populate
userSchema.virtual('items', {
  ref: 'Item',
  foreignField: 'userInfo',
  localField: '_id',
});

userSchema.pre(/^find/, function (next) {
  this.populate('favorite');
  next();
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

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
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.addFavorite = function (itemId) {
  this.favorite.push(itemId);
};

userSchema.methods.removeFavorite = function (itemId) {
  this.favorite.pull(itemId);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
