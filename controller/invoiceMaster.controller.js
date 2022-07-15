const sql = require('mssql/msnodesqlv8')
var express = require('express');
var app = express();
app.use(express.json());
var queryString = "";
const dbConfig = require("../utilities/dbConnection")
var invoiceMaster = require("../models/invoiceMaster.model")
var date = require("../utilities/dateTime")

const pool = dbConfig.getConnection();

exports.getInvoiceMasterAll = (request, response) => {
    try {
        pool.connect().then(() => {
            queryString = 'Select  [InvoiceId],[StartDate],[CustomerId],[EndDate],[TransactionActive],[TotalAmount],[PayedAmount] from dbo.[InvoiceMaster]';
            pool.request().query(queryString, (err, result) => {
                if (err) {
                    console.log(err)
                    response.sendStatus(400)
                }
                else {
                    response.status(200).send(result.recordset);
                }
            })
        })
    } catch (err) {
        console.log(err)
        response.status(500)
        response.send(err.message)
    }
};

exports.getInvoiceMasterById = (request, response) => {
    try {
        pool.connect().then(() => {
            const id = parseInt(request.params.Id);

            queryString = 'select [InvoiceId],[StartDate],[CustomerId],[EndDate],[TransactionActive],[TotalAmount],[PayedAmount] from dbo.[InvoiceMaster] where InvoiceId=@Id';
            pool.request()
                .input("Id", sql.Int, id)
                .query(queryString, (err, result) => {
                    if (err) {
                        console.log(err)
                        response.sendStatus(400)
                    }
                    else {
                        response.status(200).send(result.recordset);
                        //response.send(result.recordset);
                    }
                })
        })
    } catch (err) {
        console.log(err)
        response.status(500)
        response.send(err.message)
    }
};

exports.getInvoiceMasterByCustomerId = (request, response) => {
    try {
        pool.connect().then(() => {
            const id = parseInt(request.params.Id);

            queryString = 'select [InvoiceId],[StartDate],[CustomerId],[EndDate],[TransactionActive],[TotalAmount],[PayedAmount] from dbo.[InvoiceMaster] where CustomerId=@Id';
            pool.request()
                .input("Id", sql.Int, id)
                .query(queryString, (err, result) => {
                    if (err) {
                        console.log(err)
                        response.sendStatus(400)
                    }
                    else {
                        response.status(200).send(result.recordset);
                        //response.send(result.recordset);
                    }
                })
        })
    } catch (err) {
        console.log(err)
        response.status(500)
        response.send(err.message)
    }
};

//Post API 
exports.updateInvoiceMaster = (request, response) => {
    try {

        invoiceMaster = request.body;
        invoiceMaster.StartDate = date.getFormattedDate(invoiceMaster.StartDate)
        invoiceMaster.EndDate = date.getFormattedDate(invoiceMaster.EndDate)

        pool.connect().then(() => {
            //simple query
            queryString = 'Update dbo.InvoiceMaster ' +
                'SET CustomerId = @CustomerId,  StartDate = @StartDate, EndDate = @EndDate, TransactionActive = @TransactionActive, TotalAmount = @TotalAmount, PayedAmount = @PayedAmount ' +
                ' WHERE InvoiceId=@InvoiceId';

            pool.request()
                .input("InvoiceId", sql.Int, invoiceMaster.InvoiceId)
                .input("CustomerId", sql.Int, invoiceMaster.CustomerId)
                .input("TotalAmount", sql.Money, invoiceMaster.TotalAmount)
                .input("PayedAmount", sql.Money, invoiceMaster.PayedAmount)
                .input("StartDate", sql.Date, invoiceMaster.StartDate)
                .input("EndDate", sql.Date, invoiceMaster.EndDate)
                .input("TransactionActive", sql.Bit, invoiceMaster.TransactionActive)
                .query(queryString, (err, result) => {
                    if (err) {
                        console.log(err)
                        response.sendStatus(400)
                    }
                    else {
                        response.status(200).send("Success")
                        //response.status(200).send({message: "Success"})
                    }
                })

        })

    } catch (err) {
        console.log(err)
        response.status(500)
        response.send(err.message)
    }
};

// PUT API
exports.createInvoiceMaster = (request, response) => {
    try {

        invoiceMaster = request.body;
        invoiceMaster.StartDate = date.getFormattedDate(invoiceMaster.StartDate)
        invoiceMaster.EndDate = date.getFormattedDate(invoiceMaster.EndDate)

        pool.connect().then(() => {
            //simple query
            queryString = 'Insert Into dbo.InvoiceMaster(CustomerId, TotalAmount, PayedAmount, StartDate, EndDate, TransactionActive ) ' +
                'VALUES(@CustomerId, @TotalAmount, @PayedAmount, @StartDate,  @EndDate,  @TransactionActive) ' +
                'SELECT SCOPE_IDENTITY() as Id';

            pool.request()
                .input("CustomerId", sql.Int, invoiceMaster.CustomerId)
                .input("TotalAmount", sql.Money, invoiceMaster.TotalAmount)
                .input("PayedAmount", sql.Money, invoiceMaster.PayedAmount)
                .input("StartDate", sql.Date, invoiceMaster.StartDate)
                .input("EndDate", sql.Date, invoiceMaster.EndDate)
                .input("TransactionActive", sql.Bit, invoiceMaster.TransactionActive)
                .query(queryString, (err, result) => {
                    if (err) {
                        console.log(err)
                        response.sendStatus(400)
                    }
                    else {
                        response.status(200).send(result.recordset)
                    }
                })
        })

    } catch (err) {
        console.log(err)
        response.status(500)
        response.send(err.message)
    }
};


