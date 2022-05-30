module.exports = appProduct => {
    const invoicePayments = require("../controller/invoicePayments.controller");
    var router = require("express").Router();
  
    router.get("/getInvoicePaymentsByInvoiceId", invoicePayments.getInvoicePaymentsByInvoiceId);
   
    router.delete("/deleteInvoicePayments/:Id", invoicePayments.deleteInvoicePayments);
   
    router.put("/createInvoicePayment", invoicePayments.createInvoicePayment);
  
    appProduct.use('/Api/invoicePayments', router);
  
  };