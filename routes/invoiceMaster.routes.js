module.exports = appProduct => {
    const invoiceMaster = require("../controller/invoiceMaster.controller");
    var router = require("express").Router();
  
    router.get("/getInvoiceMasterAll", invoiceMaster.getInvoiceMasterAll);
   
    router.get("/getInvoiceMasterById/:Id", invoiceMaster.getInvoiceMasterById);
    
    router.get("/getInvoiceMasterByCustomerId", invoiceMaster.getInvoiceMasterByCustomerId);

    router.post("/updateInvoiceMaster", invoiceMaster.updateInvoiceMaster);
   
    router.put("/createInvoiceMaster", invoiceMaster.createInvoiceMaster);

    router.delete("/deleteInvoiceMaster/:Id", invoiceMaster.deleteInvoiceMaster);

    // Transformed Invoice
    router.get("/getTransformedInvoiceAll", invoiceMaster.getTransformedInvoiceAll);
  
    appProduct.use('/Api/invoiceMaster', router);
  
  };