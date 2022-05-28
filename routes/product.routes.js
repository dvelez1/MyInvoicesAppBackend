module.exports = appProduct => {
  const product = require("../controller/product.controller");
  var router = require("express").Router();

  //Get All Product
  router.get("/getProducts", product.getProducts);
  // Get Product By Id
  router.get("/getProductById/:Id", product.getProcuctById);
  // Edit Product
  router.post("/updateProduct", product.updateProduct);
  // Create
  router.put("/createProduct", product.createProduct);

  // app.use('/api/tareas', router); 
  appProduct.use('/Api/product', router);

};