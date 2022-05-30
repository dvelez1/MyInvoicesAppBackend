const sql = require('mssql/msnodesqlv8')
var express = require('express');
var app = express();
app.use(express.json());
var queryString = "";
const dbConfig = require("../utilities/dbConnection")
var product = require("../models/product.model")
var date = require("../utilities/dateTime")

const pool = dbConfig.getConnection();

exports.getProducts = (request, response) => {
    try {
        pool.connect().then(() => {
            queryString = 'Select  [ProductId],[Name],[Price],[StartDate],[EndDate] from dbo.[Product]';
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

exports.getProcuctById = (request, response) => {
    try {
        pool.connect().then(() => {
            const id = parseInt(request.params.Id);

            queryString = 'select [ProductId],[Name],[Price],[StartDate],[EndDate] from dbo.Product where ProductId=@Id';
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
exports.updateProduct = (request, response) => {
    try {

        if (!request.body.length) {
            response.sendStatus(400).send("Not record to update!")
        }
        product = request.body;
        product.StartDate = date.getFormattedDate(product.StartDate)
        product.EndDate = date.getFormattedDate(product.EndDate)

        pool.connect().then(() => {
            //simple query
            queryString = 'Update dbo.Product ' +
                'SET Name = @Name, Price = @Price, StartDate = @StartDate, EndDate = @EndDate ' +
                ' WHERE ProductId=@ProductId';

            pool.request()
                .input("ProductId", sql.Int, product.ProductId)
                .input("Name", sql.VarChar, product.Name)
                .input("Price", sql.Money, product.Price)
                .input("StartDate", sql.Date, product.StartDate)
                .input("EndDate", sql.Date, product.EndDate)
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
exports.createProduct = (request, response) => {
    try {

        if (!request.body.length) {
            response.sendStatus(400).send("Not record to update!")
        }

        product = request.body;
        product.StartDate = date.getFormattedDate(product.StartDate)
        product.EndDate = date.getFormattedDate(product.EndDate)

        pool.connect().then(() => {
            //simple query
            queryString = 'Insert Into dbo.Product(Name, Price, StartDate, EndDate ) ' +
                'VALUES(@Name, @Price, @StartDate, @EndDate) ' +
                'SELECT SCOPE_IDENTITY() as Id';

            pool.request()
                .input("ProductId", sql.Int, product.ProductId)
                .input("Name", sql.VarChar, product.Name)
                .input("Price", sql.Money, product.Price)
                .input("StartDate", sql.Date, date.getCurrentDate())
                .input("EndDate", sql.Date, null)
                .query(queryString, (err, result) => {
                    if (err) {
                        console.log(err)
                        response.sendStatus(400)
                    }
                    else {
                        response.status(200).send("success")
                    }
                })

        })

    } catch (err) {
        console.log(err)
        response.status(500)
        response.send(err.message)
    }
};


