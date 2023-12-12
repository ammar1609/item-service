const httpStatus = require('http-status-codes').StatusCodes;
const { db } = require('../startup/firebase');
const validateItem = require('../models/item.model');
const uploadPhotos = require('../helpers/uploadPhotos');

const addItem = async (req, res) => {
  const { itemName, itemDescription, price } = req.body;

  let uploadedUrls;

  const { error } = validateItem(req.body);

  if (error) {
    console.warn(`Invalid item data format: ${error}`);
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: `Invalid item data format: ${error}` });
  }

  const itemRef = await db
    .collection(process.env.ITEMS_DOC)
    .where('ownerId', '==', req.user.id)
    .where('itemName', '==', itemName)
    .get();

  if (!itemRef.empty) {
    console.warn('Item is already present for this user');
    return res
      .status(httpStatus.CONFLICT)
      .json({ error: 'Item is already present for this user' });
  }

  const newItemRef = await db.collection(process.env.ITEMS_DOC).add({
    ownerId: req.user.id,
    itemName,
    itemDescription,
    price: parseInt(price),
    photos: [],
    unavailabeDurations: [],
  });

  const photos = req.files;

  if (photos && photos.length) {
    uploadedUrls = await uploadPhotos(newItemRef.id, photos);

    await newItemRef.update({ photos: uploadedUrls });
  }

  res.status(httpStatus.CREATED).json({
    message: 'Item created successfully',
    item: {
      id: newItemRef.id,
      ownerId: req.user.id,
      itemName,
      itemDescription,
      price: parseInt(price),
      photos: uploadedUrls,
      unavailabeDurations: [],
    },
  });
};

module.exports = addItem;
