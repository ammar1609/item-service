const { bucket } = require('../startup/firebase');

const uploadPhotos = async (itemId, photos) => {
  const uploadPromises = photos.map(async (photo) => {
    const fileUpload = bucket.file(`items/${itemId}/${photo.originalname}`);
    await fileUpload.save(photo.buffer);

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '01-01-3000',
    });

    return url;
  });

  uploadedUrls = await Promise.all(uploadPromises);
  
  return uploadedUrls;
};

module.exports = uploadPhotos;
