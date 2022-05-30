module.exports = appProduct => {
    const invoiceDetails = require("../controller/invoiceDetails.controller");
    var router = require("express").Router();
  
    router.get("/getInvoiceDetailsByInvoiceId", invoiceDetails.getInvoiceDetailsByInvoiceId);
   
    router.delete("/deleteInvoiceDetails/:Id", invoiceDetails.deleteInvoiceDetails);
   
    router.put("/createInvoiceDetails", invoiceDetails.createInvoiceDetails);
  
    appProduct.use('/Api/invoiceDetails', router);
  
  };