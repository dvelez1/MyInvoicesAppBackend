var express = require('express');
var app = express();
app.use(express.json());

// Example use route and controller for the first two methods
require("./routes/product.routes")(app);

// Routes Customers

// Route Invoice Master

// Route InvoiceDetails

// Route Invoice Payment

//Serve Server
var server = app.listen(5000, function () {
    console.log('Invoice server is running..');
  });