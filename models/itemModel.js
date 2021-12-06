const mongoose = require('mongoose');
// const slugify = require('slugify');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide item name'],
      trim: true,
    },
    purchasedYear: {
      type: Number,
      required: [true, 'Please provide item purchased year'],
    },
    condition: {
      type: String,
      required: [true, 'Please provide item condition'],
      trim: true,
    },
    color: {
      type: String,
      required: [true, 'Please provide item color'],
      trim: true,
      lowercase: true,
    },
    delivery: {
      type: Boolean,
      required: [true, 'Please provide delivery option'],
    },
    dimension: {
      type: String,
      required: [true, 'Please provide item dimension'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide item description'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide item price'],
    },
    category: {
      type: String,
      required: [true, 'Please provide item category'],
      lowercase: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Item requires a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    sold: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Item must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

itemSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userInfo',
    select: '-__v -passwordChangedAt',
  });

  next();
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
