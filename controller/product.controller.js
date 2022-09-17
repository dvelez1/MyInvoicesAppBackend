const sql = require("mssql/msnodesqlv8");
var express = require("express");
var app = express();
app.use(express.json());
var queryString = "";
const dbConfig = require("../utilities/dbConnection");
var product = require("../models/product.model");
var date = require("../utilities/dateTime");

const pool = dbConfig.getConnection();
const mySql = dbConfig.getMySqlConnection();

// MySql (Select query)
// exports.getProducts = (request, response) => {
//     try {
//         queryString = 'Select  ProductId, Name,Price,StartDate,EndDate from invoices.product';
//         poolMySql.query(queryString,(err,data) =>{
//             if (err) {
//                 console.log(err)
//                 response.sendStatus(400)
//             }
//             else {
//                 console.log(data)
//                 response.status(200).send(data);
//             }
//         })

//     } catch (err) {
//         console.log(err)
//         response.status(500)
//         response.send(err.message)
//     }
// };

// MySQL with SP
exports.getProducts = (request, response) => {
  try {
    queryString = "CALL sp_product_get()";
    mySql.query(queryString, (err, data) => {
      if (err) {
        response.status(400).send(err);
      } else {
        response.status(200).send(data[0]);
      }
    });
  } catch (err) {
    console.log(err);
    response.status(500).send(err.message);
  }
};

exports.getProcuctById = async (request, response) => {
  try {
    const ProductId = parseInt(request.params.Id);
    queryString = "CALL sp_product_get_by_id(?)";
    
    await mySql.query(queryString, ProductId, (err, data) => {
      if (err) {
        response.status(400).send(err);
      } else {
        response.status(200).send(data[0]);
      }
    });
  } catch (err) {
    console.log(err);
    response.status(500).send(err.message);
  }
};

//Post API
exports.updateProduct = async (request, response) => {

  try {
    queryString = "CALL sp_product_update(?,?,?,?,?)";

    product = request.body;
    product.StartDate = date.getFormattedDate(product.StartDate);
    product.EndDate = date.getFormattedDate(product.EndDate);
    
    await mySql.query(queryString,
      (product.ProductId,product.Name, product.Price, product.StartDate, product.EndDate)
      , (err, data) => {
      if (err) {
        response.status(400).send(err);
      } else {
        response.status(200).send(data[0]);
      }
    });
  } catch (err) {
    console.log(err);
    response.status(500).send(err.message);
  }




  // try {
  //   product = request.body;
  //   product.StartDate = date.getFormattedDate(product.StartDate);
  //   product.EndDate = date.getFormattedDate(product.EndDate);

  //   pool.connect().then(() => {
  //     //simple query
  //     queryString =
  //       "Update dbo.Product " +
  //       "SET Name = @Name, Price = @Price, StartDate = @StartDate, EndDate = @EndDate " +
  //       " WHERE ProductId=@ProductId";

  //     pool
  //       .request()
  //       .input("ProductId", sql.Int, product.ProductId)
  //       .input("Name", sql.VarChar, product.Name)
  //       .input("Price", sql.Money, product.Price)
  //       .input("StartDate", sql.Date, product.StartDate)
  //       .input("EndDate", sql.Date, product.EndDate)
  //       .query(queryString, (err, result) => {
  //         if (err) {
  //           console.log(err);
  //           response.sendStatus(400);
  //         } else {
  //           response.status(200).send("Success");
  //           //response.status(200).send({message: "Success"})
  //         }
  //       });
  //   });
  // } catch (err) {
  //   console.log(err);
  //   response.status(500);
  //   response.send(err.message);
  // }
};

// PUT API
exports.createProduct = (request, response) => {
  try {
    product = request.body;
    product.StartDate = date.getFormattedDate(product.StartDate);
    product.EndDate = date.getFormattedDate(product.EndDate);

    pool.connect().then(() => {
      //simple query
      queryString =
        "Insert Into dbo.Product(Name, Price, StartDate, EndDate ) " +
        "VALUES(@Name, @Price, @StartDate, @EndDate) " +
        "SELECT SCOPE_IDENTITY() as Id";

      pool
        .request()
        .input("ProductId", sql.Int, product.ProductId)
        .input("Name", sql.VarChar, product.Name)
        .input("Price", sql.Money, product.Price)
        .input("StartDate", sql.Date, date.getCurrentDate())
        .input("EndDate", sql.Date, null)
        .query(queryString, (err, result) => {
          if (err) {
            console.log(err);
            response.sendStatus(400);
          } else {
            response.status(200).send(result.recordset);
          }
        });
    });
  } catch (err) {
    console.log(err);
    response.status(500);
    response.send(err.message);
  }
};

//#Region Methods with TSQL - SQL Server

// exports.getProducts = (request, response) => {
//     try {
//         pool.connect().then(() => {
//             queryString = 'Select  [ProductId],[Name],[Price],[StartDate],[EndDate] from dbo.[Product]';
//             pool.request().query(queryString, (err, result) => {
//                 if (err) {
//                     console.log(err)
//                     response.sendStatus(400)
//                 }
//                 else {
//                     response.status(200).send(result.recordset);
//                 }
//             })
//         })
//     } catch (err) {
//         console.log(err)
//         response.status(500)
//         response.send(err.message)
//     }
// };

// exports.getProcuctById = (request, response) => {
//     try {
//         pool.connect().then(() => {
//             const id = parseInt(request.params.Id);

//             queryString = 'select [ProductId],[Name],[Price],[StartDate],[EndDate] from dbo.Product where ProductId=@Id';
//             pool.request()
//                 .input("Id", sql.Int, id)
//                 .query(queryString, (err, result) => {
//                     if (err) {
//                         console.log(err)
//                         response.sendStatus(400)
//                     }
//                     else {
//                         response.status(200).send(result.recordset);
//                         //response.send(result.recordset);
//                     }
//                 })
//         })
//     } catch (err) {
//         console.log(err)
//         response.status(500)
//         response.send(err.message)
//     }
// };

// //Post API
// exports.updateProduct = (request, response) => {
//     try {

//         product = request.body;
//         product.StartDate = date.getFormattedDate(product.StartDate)
//         product.EndDate = date.getFormattedDate(product.EndDate)

//         pool.connect().then(() => {
//             //simple query
//             queryString = 'Update dbo.Product ' +
//                 'SET Name = @Name, Price = @Price, StartDate = @StartDate, EndDate = @EndDate ' +
//                 ' WHERE ProductId=@ProductId';

//             pool.request()
//                 .input("ProductId", sql.Int, product.ProductId)
//                 .input("Name", sql.VarChar, product.Name)
//                 .input("Price", sql.Money, product.Price)
//                 .input("StartDate", sql.Date, product.StartDate)
//                 .input("EndDate", sql.Date, product.EndDate)
//                 .query(queryString, (err, result) => {
//                     if (err) {
//                         console.log(err)
//                         response.sendStatus(400)
//                     }
//                     else {
//                         response.status(200).send("Success")
//                         //response.status(200).send({message: "Success"})
//                     }
//                 })

//         })

//     } catch (err) {
//         console.log(err)
//         response.status(500)
//         response.send(err.message)
//     }
// };

// // PUT API
// exports.createProduct = (request, response) => {
//     try {

//         product = request.body;
//         product.StartDate = date.getFormattedDate(product.StartDate)
//         product.EndDate = date.getFormattedDate(product.EndDate)

//         pool.connect().then(() => {
//             //simple query
//             queryString = 'Insert Into dbo.Product(Name, Price, StartDate, EndDate ) ' +
//                 'VALUES(@Name, @Price, @StartDate, @EndDate) ' +
//                 'SELECT SCOPE_IDENTITY() as Id';

//             pool.request()
//                 .input("ProductId", sql.Int, product.ProductId)
//                 .input("Name", sql.VarChar, product.Name)
//                 .input("Price", sql.Money, product.Price)
//                 .input("StartDate", sql.Date, date.getCurrentDate())
//                 .input("EndDate", sql.Date, null)
//                 .query(queryString, (err, result) => {
//                     if (err) {
//                         console.log(err)
//                         response.sendStatus(400)
//                     }
//                     else {
//                         response.status(200).send(result.recordset)
//                     }
//                 })

//         })

//     } catch (err) {
//         console.log(err)
//         response.status(500)
//         response.send(err.message)
//     }
// };
//#endregion
