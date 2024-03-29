// const sql = require("mssql/msnodesqlv8");
var express = require("express");
var app = express();
app.use(express.json());
var queryString = "";
const dbConfig = require("../utilities/dbConnection");
var invoiceMaster = require("../models/invoiceMaster.model");
var date = require("../utilities/dateTime");

// const pool = dbConfig.getConnection(); // For SQL Server
const mySql = dbConfig.getMySqlConnection();

exports.getInvoiceMasterById = async (request, response) => {
  try {
    const InvoiceId = parseInt(request.params.Id);
    queryString = "CALL sp_invoicemaster_get_by_id(?)";

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

// Custom Object Method
exports.getTransformedInvoiceAll = async (request, response) => {
  try {
    queryString = "CALL sp_invoicemaster_custom_get()";
    await mySql.query(queryString, (err, data) => {
      if (err) {
        response.status(400).send(err);
      } else {
        response.status(200).send(data);
      }
    });
  } catch (err) {
    console.log(err);
    response.status(500).send(err.message);
  }
};

//Post API
exports.updateInvoiceMaster = async (request, response) => {
  try {
    queryString = "CALL sp_invoicemaster_update(?,?,?,?,?,?,?,?,?)";

    invoiceMaster = request.body;
    invoiceMaster.StartDate = date.getFormattedDate(invoiceMaster.StartDate);
    invoiceMaster.EndDate = date.getFormattedDate(invoiceMaster.EndDate);

    await mySql.query(
      queryString,
      [
        invoiceMaster.InvoiceId,
        invoiceMaster.StartDate,
        invoiceMaster.CustomerId,
        invoiceMaster.EndDate,
        invoiceMaster.TransactionActive,
        invoiceMaster.TotalAmount,
        invoiceMaster.PayedAmount,
        invoiceMaster.Note,
        invoiceMaster.Void,
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

// PUT API
exports.createInvoiceMaster = async (request, response) => {
  try {
    queryString = "CALL sp_invoicemaster_create(?,?,?,?,?,?,?,?)";

    invoiceMaster = request.body;
    invoiceMaster.StartDate = date.getFormattedDate(invoiceMaster.StartDate);
    invoiceMaster.EndDate = date.getFormattedDate(invoiceMaster.EndDate);

    await mySql.query(
      queryString,
      [
        invoiceMaster.StartDate,
        invoiceMaster.CustomerId,
        invoiceMaster.EndDate,
        invoiceMaster.TransactionActive,
        invoiceMaster.TotalAmount,
        invoiceMaster.PayedAmount,
        invoiceMaster.Note,
        invoiceMaster.Void,
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

// Delete
// TODO: Pending Testing
exports.deleteInvoiceMaster = async (request, response) => {
  try {
    const InvoiceId = parseInt(request.params.Id);
    const Note = request.params.Note;
    queryString = "CALL sp_invoicemaster_delete(?,?)";

    await mySql.query(queryString, [InvoiceId, Note], (err, data) => {
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

//#region SQL Server

// exports.getInvoiceMasterAll = (request, response) => {
//   try {
//     pool.connect().then(() => {
//       queryString =
//         "Select  [InvoiceId],[StartDate],[CustomerId],[EndDate],[TransactionActive],[TotalAmount],[PayedAmount], Note from dbo.[InvoiceMaster] where Void = 0";
//       pool.request().query(queryString, (err, result) => {
//         if (err) {
//           console.log(err);
//           response.sendStatus(400);
//         } else {
//           response.status(200).send(result.recordset);
//         }
//       });
//     });
//   } catch (err) {
//     console.log(err);
//     response.status(500);
//     response.send(err.message);
//   }
// };

// exports.getInvoiceMasterById = (request, response) => {
//   try {
//     pool.connect().then(() => {
//       const id = parseInt(request.params.Id);

//       queryString =
//         "select [InvoiceId],[StartDate],[CustomerId],[EndDate],[TransactionActive],[TotalAmount],[PayedAmount], Note from dbo.[InvoiceMaster] where InvoiceId=@Id";
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

// // Custom Object Method
// exports.getTransformedInvoiceAll = (request, response) => {
//   try {
//     pool.connect().then(() => {
//       queryString =
//         " SELECT [InvoiceId],IM.[StartDate],IM.[CustomerId], C.[Name] as CustomerName, C.FirstName, C.LastName ,IM.[EndDate],[TransactionActive],[TotalAmount],[PayedAmount],[Note],[Void] " +
//         " FROM [dbo].[InvoiceMaster] as IM INNER JOIN Customer AS C ON IM.CustomerId = c.CustomerId where Void=0  order by InvoiceId ASC" +
//         " SELECT [InvoiceDetailsId],[InvoiceId],ID.[ProductId],P.[Name] as ProductName,[CatalogPrice],ID.[Price],[RemovedTransaction],[RemovedDate],[Quantity] " +
//         " FROM [dbo].[InvoiceDetails] AS ID INNER JOIN Product AS P ON ID.ProductId = P.ProductId where RemovedTransaction=0 and [InvoiceId] IN (SELECT InvoiceId FROM [dbo].[InvoiceMaster] where Void=0) order by InvoiceId ASC" +
//         " SELECT [InvoicePaiymentsId],[InvoiceId],[Payment],[TransactionDate],[RemovedTransactionDate],[RemovedTransaction] " +
//         " FROM [dbo].[InvoicePayments] WHERE RemovedTransaction = 0 and [InvoiceId] IN (SELECT InvoiceId FROM [dbo].[InvoiceMaster] where Void=0) order by InvoiceId ASC";

//       pool.request().query(queryString, (err, result) => {
//         if (err) {
//           console.log(err);
//           response.sendStatus(400);
//         } else {
//           response.status(200).send(result.recordsets);
//         }
//       });
//     });
//   } catch (err) {
//     console.log(err);
//     response.status(500);
//     response.send(err.message);
//   }
// };

// exports.getInvoiceMasterByCustomerId = (request, response) => {
//   try {
//     pool.connect().then(() => {
//       const id = parseInt(request.params.Id);

//       queryString =
//         "select [InvoiceId],[StartDate],[CustomerId],[EndDate],[TransactionActive],[TotalAmount],[PayedAmount], Note from dbo.[InvoiceMaster] where CustomerId=@Id and Void = 0";
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

// //Post API
// exports.updateInvoiceMaster = (request, response) => {
//   try {
//     invoiceMaster = request.body;
//     invoiceMaster.StartDate = date.getFormattedDate(invoiceMaster.StartDate);
//     invoiceMaster.EndDate = date.getFormattedDate(invoiceMaster.EndDate);

//     pool.connect().then(() => {
//       //simple query
//       queryString =
//         "Update dbo.InvoiceMaster " +
//         "SET CustomerId = @CustomerId,  StartDate = @StartDate, EndDate = @EndDate, TransactionActive = @TransactionActive, TotalAmount = @TotalAmount, PayedAmount = @PayedAmount, Note = @Note " +
//         " WHERE InvoiceId=@InvoiceId";

//       pool
//         .request()
//         .input("InvoiceId", sql.Int, invoiceMaster.InvoiceId)
//         .input("CustomerId", sql.Int, invoiceMaster.CustomerId)
//         .input("TotalAmount", sql.Money, invoiceMaster.TotalAmount)
//         .input("PayedAmount", sql.Money, invoiceMaster.PayedAmount)
//         .input("StartDate", sql.Date, invoiceMaster.StartDate)
//         .input("EndDate", sql.Date, invoiceMaster.EndDate)
//         .input("TransactionActive", sql.Bit, invoiceMaster.TransactionActive)
//         .input("Note", sql.VarChar, invoiceMaster.Note)
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

// // PUT API
// exports.createInvoiceMaster = (request, response) => {
//   try {
//     invoiceMaster = request.body;
//     invoiceMaster.StartDate = date.getFormattedDate(invoiceMaster.StartDate);
//     invoiceMaster.EndDate = date.getFormattedDate(invoiceMaster.EndDate);

//     pool.connect().then(() => {
//       //simple query
//       queryString =
//         "Insert Into dbo.InvoiceMaster(CustomerId, TotalAmount, PayedAmount, StartDate, EndDate, TransactionActive, Note, Void) " +
//         "VALUES(@CustomerId, @TotalAmount, @PayedAmount, @StartDate,  @EndDate,  @TransactionActive, @Note, 0) " +
//         "SELECT SCOPE_IDENTITY() as Id";

//       pool
//         .request()
//         .input("CustomerId", sql.Int, invoiceMaster.CustomerId)
//         .input("TotalAmount", sql.Money, invoiceMaster.TotalAmount)
//         .input("PayedAmount", sql.Money, invoiceMaster.PayedAmount)
//         .input("StartDate", sql.Date, invoiceMaster.StartDate)
//         .input("EndDate", sql.Date, invoiceMaster.EndDate)
//         .input("TransactionActive", sql.Bit, invoiceMaster.TransactionActive)
//         .input("Note", sql.VarChar, invoiceMaster.Note)
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

// // Delete
// exports.deleteInvoiceMaster = (request, response) => {
//   try {
//     const id = parseInt(request.params.Id);
//     invoiceMaster = request.body;

//     pool.connect().then(() => {
//       //simple query
//       queryString =
//         "Update dbo.InvoiceMaster " +
//         "SET Void = @Void, TransactionActive = @TransactionActive,  EndDate = @EndDate, Note = @Note  WHERE InvoiceId=@Id";

//       pool
//         .request()
//         .input("Id", sql.Int, id)
//         .input("EndDate", sql.Date, date.getCurrentDate())
//         .input("TransactionActive", sql.Bit, 0)
//         .input("Void", sql.Bit, 1)
//         .input("Note", sql.VarChar, invoiceMaster.Note)
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

// // Delete all parts associated to an Invoice by InvoiceId
// exports.deleteInvoiceAllByInvoiceId = (request, response) => {
//   try {
//     const id = parseInt(request.params.Id);

//     pool.connect().then(() => {
//       //simple query
//       queryString =
//         "Update dbo.InvoiceMaster " +
//         "SET Void = @Void, TransactionActive = @TransactionActive,  EndDate = @EndDate, Note = @Note  WHERE InvoiceId=@Id " +
//         " " +
//         " Update dbo.InvoiceDetails " +
//         " set RemovedTransaction =  @Void, RemovedDate = @EndDate where InvoiceId=@Id " +
//         " " +
//         " Update InvoicePayments" +
//         " set RemovedTransaction = @Void, RemovedTransactionDate = @EndDate where InvoiceId=@Id  ";

//       pool
//         .request()
//         .input("Id", sql.Int, id)
//         .input("EndDate", sql.Date, date.getCurrentDate())
//         .input("TransactionActive", sql.Bit, 0)
//         .input("Void", sql.Bit, 1)
//         .input("Note", sql.VarChar, "Error Creating a Invoice")
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

//#endregion
