const Joi = require('joi');

function validateItem(item) {
  const itemSchema = Joi.object({
    itemName: Joi.string().required(),
    itemDescription: Joi.string().optional(),
    price: Joi.number().integer().required(),
  });

  return itemSchema.validate(item);
}

module.exports = validateItem;
