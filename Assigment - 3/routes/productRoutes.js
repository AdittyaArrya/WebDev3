const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. Get All Products (with Filtering, Sorting & Pagination)
router.get('/', async (req, res, next) => {
  try {
    const { category, search, sortBy, order = 'asc', page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let queryExec = Product.find(query);

    // Sorting
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      queryExec = queryExec.sort({ [sortBy]: sortOrder });
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    queryExec = queryExec.skip(skip).limit(parseInt(limit));

    const products = await queryExec;
    const total = await Product.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
});

// 2. Low-Stock Alert Report
router.get('/low-stock', async (req, res, next) => {
  try {
    // Products where quantity <= reorderLevel
    const lowStockItems = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] }
    });

    res.json({
      count: lowStockItems.length,
      lowStockItems
    });
  } catch (error) {
    next(error);
  }
});

// 3. Category-wise Inventory Summary (Aggregation Pipeline)
router.get('/summary', async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } },
          avgPrice: { $avg: "$price" }
        }
      },
      {
        $project: {
          id: "$_id",
          _id: 0,
          totalItems: 1,
          totalQuantity: 1,
          totalStockValue: 1,
          avgPrice: 1
        }
      }
    ]);

    res.json({
      categories: summary.length,
      summary
    });
  } catch (error) {
    next(error);
  }
});

// 4. Get Single Product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// 5. Create Product API
router.post('/', async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
});

// 6. Update Product Details
router.put('/:id', async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// 7. Stock Adjustment (Increment/Decrement via PATCH)
router.patch('/:id/stock', async (req, res, next) => {
  try {
    const { change } = req.body; // e.g., +5 or -2
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.quantity += Number(change);
    if (product.quantity < 0) {
      res.status(400);
      throw new Error('Stock cannot drop below zero');
    }

    const updatedProduct = await product.save();
    res.json({
      message: 'Stock updated',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
});

// 8. Delete Product
router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({
      message: 'Product deleted',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;