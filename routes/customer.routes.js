module.exports = appProduct => {
    const customer = require("../controller/customer.controller");
    var router = require("express").Router();
  
    router.get("/getCustomers", customer.getCustomers);
   
    router.get("/getCustomerById/:Id", customer.getCustomerById);
    
    router.post("/updateCustomer", customer.updateCustomer);
   
    router.put("/createCustomer", customer.createCustomer);
  
    appProduct.use('/Api/customer', router);
  
  };