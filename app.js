var express = require('express');
var app = express();
app.use(express.json());

// Example use route and controller for the first two methods
require("./routes/product.routes")(app);
// Routes Customers
require("./routes/customer.routes")(app);
// Route Invoice Master
require("./routes/invoiceMaster.routes")(app);
// Route InvoiceDetails
require("./routes/InvoiceDetails.route")(app);
// Route Invoice Payment
require("./routes/invoicePayments.route")(app);

//Serve Server
var server = app.listen(5000, function () {
    console.log('Invoice server is running..');
  });