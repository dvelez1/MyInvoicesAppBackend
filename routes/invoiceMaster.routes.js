module.exports = (appProduct) => {
  const invoiceMaster = require("../controller/invoiceMaster.controller");
  var router = require("express").Router();

  router.get("/getInvoiceMasterById/:Id", invoiceMaster.getInvoiceMasterById);

  // Transformed Invoice
  router.get(
    "/getTransformedInvoiceAll",
    invoiceMaster.getTransformedInvoiceAll
  );

  router.post("/updateInvoiceMaster", invoiceMaster.updateInvoiceMaster);

  router.put("/createInvoiceMaster", invoiceMaster.createInvoiceMaster);

  router.delete("/deleteInvoiceMaster/:Id", invoiceMaster.deleteInvoiceMaster);

  //router.delete("/deleteInvoiceAllByInvoiceId/:Id", invoiceMaster.deleteInvoiceMaster);
  //router.get("/getInvoiceMasterAll", invoiceMaster.getInvoiceMasterAll);
  //router.get("/getInvoiceMasterByCustomerId", invoiceMaster.getInvoiceMasterByCustomerId);

  appProduct.use("/Api/invoiceMaster", router);
};
