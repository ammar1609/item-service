const httpStatus = require('http-status-codes').StatusCodes;
const { db, FieldPath } = require('../startup/firebase');

const deleteMyItem = async (req, res) => {
  const itemId = req.params.id;

  const itemRef = await db
    .collection(process.env.ITEMS_DOC)
    .where('ownerId', '==', req.user.id)
    .where(FieldPath.documentId(), '==', itemId)
    .limit(1)
    .get();

  if (itemRef.empty) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: 'Item not found for the user' });
  }

  const itemDocRef = itemRef.docs[0].ref;
  const itemDoc = await itemDocRef.get();

  await db
    .collection(process.env.ITEMS_DOC)
    .doc(itemDoc.id)
    .delete();

  res.status(httpStatus.NO_CONTENT).end();
};

module.exports = deleteMyItem;
