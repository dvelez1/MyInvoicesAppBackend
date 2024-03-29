// const sql = require("mssql/msnodesqlv8");
var express = require("express");
var app = express();
app.use(express.json());
var queryString = "";
const dbConfig = require("../utilities/dbConnection");
var customer = require("../models/customer.model");
var date = require("../utilities/dateTime");

// const pool = dbConfig.getConnection(); // For Sql Server DB
const mySql = dbConfig.getMySqlConnection();

exports.getCustomers = async (request, response) => {
  try {
    queryString = "CALL sp_customer_get()";
    await mySql.query(queryString, (err, data) => {
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

exports.getCustomerById = async (request, response) => {
  try {
    const CustomerId = parseInt(request.params.Id);
    queryString = "CALL sp_customer_get_by_id(?)";

    await mySql.query(queryString, CustomerId, (err, data) => {
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
exports.updateCustomer = async (request, response) => {
  try {
    queryString = "CALL sp_customer_update(?,?,?,?,?,?,?,?,?,?,?,?)";

    customer = request.body;
    customer.StartDate = date.getFormattedDate(customer.StartDate);
    customer.EndDate = date.getFormattedDate(customer.EndDate);

    await mySql.query(
      queryString,
      [
        customer.CustomerId,
        customer.Name,
        customer.MiddleName,
        customer.FirstName,
        customer.LastName,
        customer.Address1,
        customer.Address2,
        customer.City,
        customer.State,
        customer.ZipCode,
        customer.StartDate,
        customer.EndDate,
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
exports.createCustomer = async (request, response) => {
  try {
    queryString = "CALL sp_customer_create(?,?,?,?,?,?,?,?,?,?,?)";

    customer = request.body;
    customer.StartDate = date.getFormattedDate(customer.StartDate);
    customer.EndDate = date.getFormattedDate(customer.EndDate);

    await mySql.query(
      queryString,
      [
        customer.Name,
        customer.MiddleName,
        customer.FirstName,
        customer.LastName,
        customer.Address1,
        customer.Address2,
        customer.City,
        customer.State,
        customer.ZipCode,
        customer.StartDate,
        customer.EndDate,
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

// exports.getCustomers = (request, response) => {
//     try {
//         pool.connect().then(() => {
//             queryString = 'Select  [CustomerId],[Name],[MiddleName],[FirstName],[LastName],[Address1],[Address2],[City],[State],[ZipCode],[StartDate],[EndDate] from dbo.[Customer]';
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

// exports.getCustomerById = (request, response) => {
//     try {
//         pool.connect().then(() => {
//             const id = parseInt(request.params.Id);

//             queryString = 'select [CustomerId],[Name],[MiddleName],[FirstName],[LastName],[Address1],[Address2],' +
//                 '[City],[State],[ZipCode],[StartDate],[EndDate] ' +
//                 'from dbo.[Customer] where CustomerId=@Id';
//             pool.request()
//                 .input("Id", sql.Int, id)
//                 .query(queryString, (err, result) => {
//                     if (err) {
//                         console.log(err)
//                         response.sendStatus(400)
//                     }
//                     else {
//                         response.status(200).send(result.recordset);
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
// exports.updateCustomer = (request, response) => {
//     try {
//         customer = request.body;
//         customer.StartDate = date.getFormattedDate(customer.StartDate);
//         customer.EndDate = customer.EndDate == null ? date.getFormattedDate(customer.EndDate) : null;

//         pool.connect().then(() => {
//             //simple query
//             queryString = 'Update dbo.Customer ' +
//                 'SET Name = @Name, MiddleName = @MiddleName, FirstName = @FirstName, LastName = @LastName, ' +
//                 'Address1 = @Address1, Address2 = @Address2, City = @City, State = @State, ' +
//                 'ZipCode = @ZipCode, StartDate = @StartDate, EndDate = @EndDate ' +
//                 ' WHERE CustomerId=@CustomerId';

//             pool.request()
//                 .input("CustomerId", sql.Int, customer.CustomerId)
//                 .input("Name", sql.VarChar, customer.Name)
//                 .input("MiddleName", sql.VarChar, customer.MiddleName)
//                 .input("FirstName", sql.VarChar, customer.FirstName)
//                 .input("LastName", sql.VarChar, customer.LastName)
//                 .input("Address1", sql.VarChar, customer.Address1)
//                 .input("Address2", sql.VarChar, customer.Address2)
//                 .input("City", sql.VarChar, customer.City)
//                 .input("State", sql.VarChar, customer.State)
//                 .input("ZipCode", sql.VarChar, customer.ZipCode)
//                 .input("StartDate", sql.Date, customer.StartDate)
//                 .input("EndDate", sql.Date, customer.EndDate)
//                 .query(queryString, (err, result) => {
//                     if (err) {
//                         console.log(err)
//                         response.sendStatus(400)
//                     }
//                     else {
//                         response.status(200).send("success")
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
// exports.createCustomer = (request, response) => {
//     try {

//         customer = request.body;
//         customer.StartDate = date.getFormattedDate(customer.StartDate);
//         customer.EndDate = null;

//         queryString = 'Update dbo.Customer ' +
//             'SET Name = @Name, MiddleName = @MiddleName, FirstName = @FirstName, LastName = @LastName ' +
//             'Address1 = @Address1, Address2 = @Address2, City = @City, State = @State ' +
//             'ZipCode = @ZipCode, StartDate = @StartDate, EndDate = @EndDate ' +
//             ' WHERE CustomerId=@CustomerId ' +
//             'SELECT SCOPE_IDENTITY() as Id';

//         pool.connect().then(() => {
//             //simple query
//             queryString = 'Insert Into dbo.Customer(Name,MiddleName,FirstName,LastName,Address1,Address2,City,State,ZipCode,StartDate,EndDate ) ' +
//                 'VALUES(@Name,@MiddleName,@FirstName,@LastName,@Address1,@Address2,@City,@State,@ZipCode,@StartDate,@EndDate)';

//             pool.request()
//                 .input("Name", sql.VarChar, customer.Name)
//                 .input("MiddleName", sql.VarChar, customer.MiddleName)
//                 .input("FirstName", sql.VarChar, customer.FirstName)
//                 .input("LastName", sql.VarChar, customer.LastName)
//                 .input("Address1", sql.VarChar, customer.Address1)
//                 .input("Address2", sql.VarChar, customer.Address2)
//                 .input("City", sql.VarChar, customer.City)
//                 .input("State", sql.VarChar, customer.State)
//                 .input("ZipCode", sql.VarChar, customer.ZipCode)
//                 .input("StartDate", sql.Date, customer.StartDate)
//                 .input("EndDate", sql.Date, customer.EndDate)
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
