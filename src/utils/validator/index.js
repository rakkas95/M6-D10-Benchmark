const { body } = require("express-validator");

const validateProduct = [
  body("name").notEmpty().isString(),
  body("description").isString(),
  body("brand").notEmpty().isString(),
  body("imageUrl").isURL(),
  body("price").isString(),
  body("category.name").isString(),
];

const validateReview = [
  body("comment").notEmpty().isString(),
  body('rate').notEmpty().isInt(),
  body("product_id").isInt(),
];

const validateCategory = [
  body("name").notEmpty().isString(),
];

module.exports = { validateProduct, validateReview, validateCategory };