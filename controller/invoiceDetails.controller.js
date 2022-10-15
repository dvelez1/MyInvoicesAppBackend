const sql = require("mssql/msnodesqlv8");
var express = require("express");
var app = express();
app.use(express.json());
var queryString = "";
const dbConfig = require("../utilities/dbConnection");
var invoiceDetails = require("../models/invoiceDetails.model");
var date = require("../utilities/dateTime");

const pool = dbConfig.getConnection(); // For Sql Server DB
const mySql = dbConfig.getMySqlConnection();

exports.getInvoiceDetailsByInvoiceId = async (request, response) => {
  try {
    const InvoiceId = parseInt(request.params.Id);
    queryString = "CALL sp_invoicedetails_get_by_invoiceid(?)";

    await mySql.query(queryString, InvoiceId, (err, data) => {
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

exports.deleteInvoiceDetails = async (request, response) => {
  try {
    const InvoiceDetailsId = parseInt(request.params.Id);
    queryString = "CALL sp_invoicedetails_delete(?)";

    await mySql.query(queryString, InvoiceDetailsId, (err, data) => {
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

// PUT API (Create)
exports.createInvoiceDetails = async (request, response) => {
  try {
    queryString = "CALL sp_invoicedetails_create(?,?,?,?,?,?,?)";

    invoiceDetails = request.body;
    invoiceDetails.RemovedDate = date.getFormattedDate(
      invoiceDetails.RemovedDate
    );

    await mySql.query(
      queryString,
      [
        invoiceDetails.InvoiceId,
        invoiceDetails.ProductId,
        invoiceDetails.CatalogPrice,
        invoiceDetails.Price,
        invoiceDetails.RemovedTransaction,
        invoiceDetails.RemovedDate,
        invoiceDetails.Quantity,
      ],
      (err, data) => {
        if (err) {
          response.status(400).send(err);
        } else {
          response.status(200).send(data[0]);
        }
      }
    );
  } catch (err) {
    console.log(err);
    response.status(500).send(err.message);
  }
};

//#region SQL Server

// exports.getInvoiceDetailsByInvoiceId = (request, response) => {
//   try {
//     pool.connect().then(() => {
//       const id = parseInt(request.params.Id);

//       queryString =
//         "select [InvoiceDetailsId],[InvoiceId],[ProductId], [Quantity],[CatalogPrice],[Price],[RemovedTransaction], RemovedDate from dbo.[InvoiceDetails] where InvoiceId=@Id and RemovedTransaction = 0";
//       pool
//         .request()
//         .input("Id", sql.Int, id)
//         .query(queryString, (err, result) => {
//           if (err) {
//             console.log(err);
//             response.sendStatus(400);
//           } else {
//             response.status(200).send(result.recordset);
//             //response.send(result.recordset);
//           }
//         });
//     });
//   } catch (err) {
//     console.log(err);
//     response.status(500);
//     response.send(err.message);
//   }
// };

// exports.deleteInvoiceDetails = (request, response) => {
//   try {
//     const id = parseInt(request.params.Id);

//     pool.connect().then(() => {
//       //simple query
//       queryString =
//         "Update dbo.InvoiceDetails " +
//         "SET RemovedTransaction = @RemovedTransaction,  RemovedDate = @RemovedDate WHERE InvoiceDetailsId=@Id";

//       pool
//         .request()
//         .input("Id", sql.Int, id)
//         .input("RemovedDate", sql.Date, date.getCurrentDate())
//         .input("RemovedTransaction", sql.Bit, 1)
//         .query(queryString, (err, result) => {
//           if (err) {
//             console.log(err);
//             response.sendStatus(400);
//           } else {
//             response.status(200).send("Success");
//             //response.status(200).send({message: "Success"})
//           }
//         });
//     });
//   } catch (err) {
//     console.log(err);
//     response.status(500);
//     response.send(err.message);
//   }
// };

// // PUT API (Create)
// exports.createInvoiceDetails = (request, response) => {
//   try {
//     invoiceDetails = request.body;
//     invoiceDetails.RemovedDate = date.getFormattedDate(
//       invoiceDetails.RemovedDate
//     );

//     pool.connect().then(() => {
//       //simple query
//       queryString =
//         "Insert Into dbo.InvoiceDetails([InvoiceId],[ProductId], [Quantity], [CatalogPrice],[Price],[RemovedTransaction], RemovedDate) " +
//         "VALUES(@InvoiceId, @ProductId, @Quantity, @CatalogPrice, @Price,  @RemovedTransaction, @RemovedDate) " +
//         "SELECT SCOPE_IDENTITY() as Id";

//       pool
//         .request()
//         .input("InvoiceId", sql.Int, invoiceDetails.InvoiceId)
//         .input("ProductId", sql.Int, invoiceDetails.ProductId)
//         .input("Quantity", sql.Int, invoiceDetails.Quantity)
//         .input("CatalogPrice", sql.Money, invoiceDetails.CatalogPrice)
//         .input("Price", sql.Money, invoiceDetails.Price)
//         .input("RemovedTransaction", sql.Bit, invoiceDetails.RemovedTransaction)
//         .input("RemovedDate", sql.Date, invoiceDetails.RemovedDate)
//         .query(queryString, (err, result) => {
//           if (err) {
//             console.log(err);
//             response.sendStatus(400);
//           } else {
//             response.status(200).send(result.recordset);
//           }
//         });
//     });
//   } catch (err) {
//     console.log(err);
//     response.status(500);
//     response.send(err.message);
//   }
// };

//#endregion
