const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.body.user) req.body.userInfo = req.user._id;
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.itemId) filter = { item: req.params.itemId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // console.log(features);
    // const query2 = features.query.options.limit;
    // console.log(query2);
    const features2 = new APIFeatures(Model.find(filter), req.query);
    features2.queryString.limit = 9999;
    features2.queryString.page = 1;
    // features2.queryString.skip = 0;
    features2.filter().sort().limitFields().paginate();

    const doc2 = await features2.query;
    const totalCount = doc2.length;
    // console.log(features2.query);

    // const doc = await features.query.explain();
    const count = await Model.countDocuments();
    console.log(totalCount);
    const doc = await features.query;
    const result = doc.length;
    // console.log(features.query);

    // Get Current Page
    const page = features.query.options.skip / features.query.options.limit + 1;
    // Get Current Limit Value
    const per_page = features.query.options.limit;

    // Has Next Page(Boolean Value)
    const hasNextPage = per_page * page < count;

    // Has Previous Page(Boolean Value)
    const hasPrevPage = features.query.options.skip / per_page + 1 > 1;

    const totalPageNum = totalCount / 20 + 1;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      total_docs: count,
      result,
      page,
      page_limit: features.query.options.limit,
      totalPageNumber: Math.floor(totalPageNum),
      hasNextPage,
      hasPrevPage,
      data: {
        doc,
      },
    });
  });

exports.getSearch = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.itemId) filter = { item: req.params.itemId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .search()
      .sort()
      .limitFields()
      .paginate();

    // console.log(features);
    // const query2 = features.query.options.limit;
    // console.log(query2);
    const features2 = new APIFeatures(Model.find(filter), req.query);
    features2.queryString.limit = 9999;
    features2.filter().sort().limitFields().paginate();

    const doc2 = await features2.query;
    const totalCount = doc2.length;
    // console.log(totalCount);

    // const doc = await features.query.explain();
    const count = await Model.countDocuments();
    const doc = await features.query;
    const result = doc.length;
    // console.log(features.query);

    // Get Current Page
    const page = features.query.options.skip / features.query.options.limit + 1;
    // Get Current Limit Value
    const per_page = features.query.options.limit;

    // Has Next Page(Boolean Value)
    const hasNextPage = per_page * page < count;

    // Has Previous Page(Boolean Value)
    const hasPrevPage = features.query.options.skip / per_page + 1 > 1;

    const totalPageNum = totalCount / 20 + 1;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      total_docs: count,
      result,
      page,
      page_limit: features.query.options.limit,
      totalPageNumber: Math.floor(totalPageNum),
      hasNextPage,
      hasPrevPage,
      data: {
        doc,
      },
    });
  });
