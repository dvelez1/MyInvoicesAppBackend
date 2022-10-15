const sql = require("mssql/msnodesqlv8");
var express = require("express");
var app = express();
app.use(express.json());
var queryString = "";
const dbConfig = require("../utilities/dbConnection");
var invoicePayments = require("../models/InvoicePayments.model");
var date = require("../utilities/dateTime");

const pool = dbConfig.getConnection(); // For Sql Server DB
const mySql = dbConfig.getMySqlConnection();

exports.getInvoicePaymentsByInvoiceId = async (request, response) => {
  try {
    const InvoiceId = parseInt(request.params.Id);
    queryString = "CALL sp_invoicepayments_get_by_invoiceid(?)";

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

//Delete API
exports.deleteInvoicePayments = async (request, response) => {
  try {
    const InvoicePaiymentsId = parseInt(request.params.Id);
    queryString = "CALL sp_invoicepayments_delete(?)";

    await mySql.query(queryString, InvoicePaiymentsId, (err, data) => {
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

// PUT API
exports.createInvoicePayment = async (request, response) => {
  try {
    queryString = "CALL sp_invoicepayments_create(?,?,?,?,?)";

    invoicePayments = request.body;
    invoicePayments.TransactionDate = date.getFormattedDate(
      invoicePayments.TransactionDate
    );
    invoicePayments.RemovedTransactionDate = date.getFormattedDate(
      invoicePayments.RemovedTransactionDate
    );

    await mySql.query(
      queryString,
      [
        invoicePayments.InvoiceId,
        invoicePayments.Payment,
        invoicePayments.TransactionDate,
        invoicePayments.RemovedTransactionDate,
        invoicePayments.RemovedTransaction,
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

// exports.getInvoicePaymentsByInvoiceId = (request, response) => {
//     try {
//         pool.connect().then(() => {
//             const id = parseInt(request.params.Id);

//             queryString = 'select  [InvoicePaiymentsId],[InvoiceId],[Payment],[TransactionDate],[RemovedTransactionDate],[RemovedTransaction] from dbo.[InvoicePayments] where InvoiceId=@Id';
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

// //Delete API
// exports.deleteInvoicePayments = (request, response) => {
//     try {

//         const id = parseInt(request.params.Id);

//         pool.connect().then(() => {
//             //simple query
//             queryString = 'Update dbo.InvoicePayments ' +
//                 'SET RemovedTransactionDate = @RemovedTransactionDate,  RemovedTransaction = @RemovedTransaction WHERE InvoicePaiymentsId=@Id'

//             pool.request()
//                 .input("Id", sql.Int, id)
//                 .input("RemovedTransactionDate", sql.Date, date.getCurrentDate())
//                 .input("RemovedTransaction", sql.Bit, 1)
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
// exports.createInvoicePayment = (request, response) => {
//     try {
//         invoicePayments = request.body;
//         invoicePayments.TransactionDate = date.getFormattedDate(invoicePayments.TransactionDate)
//         invoicePayments.RemovedTransactionDate = date.getFormattedDate(invoicePayments.RemovedTransactionDate)

//         pool.connect().then(() => {
//             //simple query
//             queryString = 'Insert Into dbo.InvoicePayments([InvoiceId],[Payment],[TransactionDate],[RemovedTransaction],[RemovedTransactionDate]) ' +
//                 'VALUES(@InvoiceId, @Payment, @TransactionDate,@RemovedTransaction, @RemovedTransactionDate ) ' +
//                 'SELECT SCOPE_IDENTITY() as Id';

//             pool.request()
//                 .input("InvoiceId", sql.Int, invoicePayments.InvoiceId)
//                 .input("Payment", sql.Money, invoicePayments.Payment)
//                 .input("TransactionDate", sql.Date, invoicePayments.TransactionDate)
//                 .input("RemovedTransaction", sql.Bit, invoicePayments.RemovedTransaction)
//                 .input("RemovedTransactionDate", sql.Date, invoicePayments.RemovedTransactionDate)
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
