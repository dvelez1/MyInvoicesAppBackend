const sql = require('mssql/msnodesqlv8')
var express = require('express');
var app = express();
app.use(express.json());
var queryString = "";
const dbConfig = require("../utilities/dbConnection")
var invoiceDetails = require("../models/invoiceDetails.model")
var date = require("../utilities/dateTime")

const pool = dbConfig.getConnection();

exports.getInvoiceDetailsByInvoiceId = (request, response) => {
    try {
        pool.connect().then(() => {
            const id = parseInt(request.params.Id);

            queryString = 'select [InvoiceDetailsId],[InvoiceId],[ProductId], [Quantity],[CatalogPrice],[Price],[RemovedTransaction], RemovedDate from dbo.[InvoiceDetails] where InvoiceId=@Id and RemovedTransaction = 0';
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

exports.deleteInvoiceDetails = (request, response) => {
    try {

        const id = parseInt(request.params.Id);

        pool.connect().then(() => {
            //simple query
            queryString = 'Update dbo.InvoiceDetails ' +
                'SET RemovedTransaction = @RemovedTransaction,  RemovedDate = @RemovedDate WHERE InvoiceDetailsId=@Id'

            pool.request()
                .input("Id", sql.Int, id)
                .input("RemovedDate", sql.Date, date.getCurrentDate())
                .input("RemovedTransaction", sql.Bit, 1)
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

// PUT API (Create)
exports.createInvoiceDetails = (request, response) => {
    try {

        invoiceDetails = request.body;
        invoiceDetails.RemovedDate = date.getFormattedDate(invoiceDetails.RemovedDate)

        pool.connect().then(() => {
            //simple query
            queryString = 'Insert Into dbo.InvoiceDetails([InvoiceId],[ProductId], [Quantity], [CatalogPrice],[Price],[RemovedTransaction], RemovedDate) ' +
                'VALUES(@InvoiceId, @ProductId, @Quantity, @CatalogPrice, @Price,  @RemovedTransaction, @RemovedDate) ' + 
                'SELECT SCOPE_IDENTITY() as Id';

            pool.request()
                .input("InvoiceId", sql.Int, invoiceDetails.InvoiceId)
                .input("ProductId", sql.Int, invoiceDetails.ProductId)
                .input("Quantity", sql.Int, invoiceDetails.Quantity)
                .input("CatalogPrice", sql.Money, invoiceDetails.CatalogPrice)
                .input("Price", sql.Money, invoiceDetails.Price)
                .input("RemovedTransaction", sql.Bit, invoiceDetails.RemovedTransaction)
                .input("RemovedDate", sql.Date, invoiceDetails.RemovedDate)
                .query(queryString, (err, result) => {
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


