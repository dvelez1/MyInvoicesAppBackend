var express = require("express");
const cors = require("cors");
require('dotenv').config(); 
const routes = require('./routes/routes');
const PORT = process.env.PORT || 5000;

// CORS Added to allow request from specific origin

// Commented temporary
// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

var app = express();
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors()); 

// // Example use route and controller for the first two methods
// require("./routes/product.routes")(app);
// // Routes Customers
// require("./routes/customer.routes")(app);
// // Route Invoice Master
// require("./routes/invoiceMaster.routes")(app);
// // Route InvoiceDetails
// require("./routes/InvoiceDetails.route")(app);
// // Route Invoice Payment
// require("./routes/invoicePayments.route")(app);

app.use('/msim/', routes());

//Serve Server
var server = app.listen(PORT, function () {
  console.log("Invoice server is running..");
});

