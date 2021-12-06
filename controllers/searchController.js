const catchAsync = require('../utils/catchAsync');
const Item = require('./../models/itemModel');
const factory = require('./handlerFactory');

exports.itemSearch2 = catchAsync(async (req, res) => {
  const search = req.body.itemName;
  const ppage = req.body.page * 1 || 1;
  const limit = req.body.limit * 1 || 100;
  const skip = (ppage - 1) * limit;

  const doc = await Item.find({
    name: { $regex: search, $options: 'i' },
  });

  const result = doc.length;

  const page = skip / limit + 1;
  // Get Current Limit Value
  const per_page = limit;

  // Has Next Page(Boolean Value)
  const hasNextPage = per_page * page < result;

  // Has Previous Page(Boolean Value)
  const hasPrevPage = skip / per_page + 1 > 1;

  const totalPageNum = result / limit + 1;

  res.status(200).json({
    result,
    page,
    page_limit: limit,
    totalPageNumber: Math.floor(totalPageNum),
    hasNextPage,
    hasPrevPage,
    data: doc,
  });
});

exports.itemSearch = factory.getSearch(Item);
