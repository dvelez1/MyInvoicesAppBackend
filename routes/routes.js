const express = require("express");
const router = express();
const product = require("../controller/product.controller");
const customer = require("../controller/customer.controller");
const invoiceMaster = require("../controller/invoiceMaster.controller");
const invoiceDetails = require("../controller/invoiceDetails.controller");
const invoicePayments = require("../controller/invoicePayments.controller");

module.exports = () => {
  //#region Product Routes

  //Get All Product
  router.get("/product/getProducts", product.getProducts);
  // Get Product By Id
  router.get("/product/getProductById/:Id", product.getProcuctById);
  // Edit Product
  router.post("/product/updateProduct", product.updateProduct);
  // Create
  router.put("/product/createProduct", product.createProduct);

  //#endregion

  //#region Customer Routes

  router.get("/customer/getCustomers", customer.getCustomers);

  router.get("/customer/getCustomerById/:Id", customer.getCustomerById);

  router.post("/customer/updateCustomer", customer.updateCustomer);

  router.put("/customer/createCustomer", customer.createCustomer);

  //#endregion

  //#region Invoice Master Routes

  router.get(
    "/invoiceMaster/getInvoiceMasterById/:Id",
    invoiceMaster.getInvoiceMasterById
  );

  // Transformed Invoice
  router.get(
    "/invoiceMaster/getTransformedInvoiceAll",
    invoiceMaster.getTransformedInvoiceAll
  );

  router.post(
    "/invoiceMaster/updateInvoiceMaster",
    invoiceMaster.updateInvoiceMaster
  );

  router.put(
    "/invoiceMaster/createInvoiceMaster",
    invoiceMaster.createInvoiceMaster
  );

  router.delete(
    "/invoiceMaster/deleteInvoiceMaster/:Id",
    invoiceMaster.deleteInvoiceMaster
  );

  //#endregion

  //#region Invoice Details Routes

  router.get(
    "/invoiceDetails/getInvoiceDetailsByInvoiceId",
    invoiceDetails.getInvoiceDetailsByInvoiceId
  );

  router.delete(
    "/invoiceDetails/deleteInvoiceDetails/:Id",
    invoiceDetails.deleteInvoiceDetails
  );

  router.put(
    "/invoiceDetails/createInvoiceDetails",
    invoiceDetails.createInvoiceDetails
  );

  //#endregion

  //#region Invoice Payment Routes

  router.get(
    "/invoicePayments/getInvoicePaymentsByInvoiceId",
    invoicePayments.getInvoicePaymentsByInvoiceId
  );

  router.delete(
    "/invoicePayments/deleteInvoicePayments/:Id",
    invoicePayments.deleteInvoicePayments
  );

  router.put(
    "/invoicePayments/createInvoicePayment",
    invoicePayments.createInvoicePayment
  );

  //#endregion

  return router;
};
