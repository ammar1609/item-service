const httpStatus = require('http-status-codes').StatusCodes;
const { db } = require('../startup/firebase');

const searchItems = async (req, res) => {
  const { keyword } = req.query;

  let itemRef;

  if (!keyword || keyword == '') {
    itemRef = await db
      .collection(process.env.ITEMS_DOC)
      .get();
  } else {
    itemRef = await db
      .collection(process.env.ITEMS_DOC)
      .where('itemName', '>=', keyword)
      .where('itemName', '<=', keyword + '\uf8ff')
      .get();
  }

  if (itemRef.empty) {
    return res.status(httpStatus.NOT_FOUND).json({ error: 'Items not found' });
  }

  const itemsData = [];
  itemRef.forEach((itemDoc) => {
    const itemData = itemDoc.data();
    itemsData.push({ id: itemDoc.id, ...itemData });
  });

  res.status(httpStatus.OK).json(itemsData);
};

module.exports = searchItems;
