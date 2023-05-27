const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // especifica la carpeta donde se guardarán las imágenes temporalmente

const Product = require('../models/product');

// Ruta para agregar un nuevo producto
router.post('/products', upload.single('image'), async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: {
      data: req.file.buffer,
      contentType: req.file.mimetype
    }
  });

  try {
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get('/products/:id/image', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.image) {
      return res.status(404).send({ error: 'Product not found' });
    }

    res.set('Content-Type', product.image.contentType);
    res.send(product.image.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    const productsWithImageUrls = products.map((product) => ({
      ...product._doc,
      imageUrl: `http://localhost:9000/api/products/${product._id}/image`,
    }));
    res.send(productsWithImageUrls);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Ruta para obtener un producto por su ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Ruta para editar un producto
router.patch('/products/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'description', 'price', 'category'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }

    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();

    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
