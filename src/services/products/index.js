const router = require("express").Router();
const { validationResult } = require("express-validator");
const Model = require("../../utils/model");
const Products = new Model("products");
const Reviews = new Model("reviews");
const db = require("../../utils/db");
const { validateProduct, validateReview } = require("../../utils/validator");

const convertProductBody = (obj) => {
  const newProduct = { ...obj };
  newProduct.id = req.body._id;
  newProduct.productId = req.body.product._id;
  newProduct.categoryId = req.body.category._id;
  delete req.body._id, req.product, req.body.category;
  return newProduct;
};

const productQuery = `SELECT p.id AS _id, p.name AS "name", p.description AS "description", p.price AS "price", p.imageUrl AS image, p.created_at AS "createdAt", p.updated_at AS "updatedAt", c.name AS "categoryName", c.id AS "categoryId", b.name AS brand
FROM products AS p
JOIN categories AS c ON c.id = p.categoryId
JOIN brands AS b ON brands.id = p.brandId
  `;

const productsQuery = `SELECT
p.name AS "name", p.description AS "description", p.price AS "price", p.imageUrl AS image, p.created_at AS "createdAt", p.updated_at AS "updatedAt",
CONCAT('{',json_object_agg('_id', brands.id),', ',json_object_agg('name', CONCAT(' ',brands.name))'}') AS brand,
CONCAT('{',json_object_agg('_id', categories.id),', ',json_object_agg('name', categories.name)'}') AS category,
json_agg(row_to_json((SELECT ColName FROM (SELECT r.id, r.comment, r.rate, r.created_at) AS ColName (_id, "comment", "rate", "createdAt")))) AS reviews
FROM products AS p
INNER JOIN categories ON p.categoryId = categories.id
INNER JOIN brands ON brands.id = p.brandId
INNER JOIN reviews AS r ON r.brandId = p.id
GROUP BY p.id`;

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await db.query(productsQuery);
    const response = { products: rows };
    res.send(response);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `${productQuery} WHERE p.id=${req.params.id}`
    );
    rows["category"] = {
      _id: rows.categoryId,
      name: rows.categoryName,
    };
    const reviews = await db.query(`
    SELECT brands.name AS name, comment FROM reviews
    INNER JOIN products ON reviews.product_id = products.id
    INNER JOIN brands ON reviews.brand_id = brands.id
    WHERE products.id=${req.params.id}
    `);
    let response = {
      ...rows[0],
      reviews: reviews.rows,
    };
    console.log(response);
    res.send(response);
  } catch (e) {
    next(e);
  }
});

router.get("/:productId/reviews", async (req, res, next) => {
  try {
    const { rows } = await Reviews.run(
      `SELECT * FROM reviews WHERE product_id = '${req.params.productId}'`
    );
    res.send(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const { rows } = await Reviews.findById(req.params.reviewId);
    res.send(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post("/", validateProduct, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(err(errors.array(), 404));
    const request = convertProductBody(req.body);
    const response = await Products.save(request);
    res.status(201).send(response);
  } catch (e) {
    next(e);
  }
});

router.post("/:id", validateReview, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(err(errors.array(), 404));
    const res = await Reviews.save(req.body);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validateProduct, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(err(errors.array(), 404));
    const body = convertProductBody(req.body);
    const response = await Products.findByIdAndUpdate(req.params.id, body);
    res.send(response);
  } catch (e) {
    next(e);
  }
});

router.put("/:articleId/reviews/:reviewId", async (req, res, next) => {
  try {
    const res = await Reviews.findByIdAndUpdate(req.params.reviewId, {
      comment: req.body.comment,
      brand_id: req.body.brandId,
      product_id: req.params.productId,
    });
    res.send(res);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { rows } = await Products.findByIdAndDelete(req.params.id);
    res.send(rows);
  } catch (e) {
    next(e);
  }
});

router.delete("/:productId/reviews/:reviewsId", async (req, res, next) => {
  try {
    const { rows } = await Reviews.findByIdAndDelete(req.params.reviewId);
    res.send(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;