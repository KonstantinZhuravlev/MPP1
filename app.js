const express = require("express");
 
const app = express();

const mysql = require("mysql2");

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var count = 0;

let productId = new Array();
let productName = new Array();
let productNumber = new Array();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "shop_list",
  password: "QAZWSXEDC"
});

const sql = `SELECT * FROM products`; //products
 
connection.query(sql, function(err, results) {
    if(err) console.log(err);
    var products = results;
    //console.log(results);
    for(let i=0; i < products.length; i++){
        productId[i] = i+1;
        productName[i] = products[i].name;
        productNumber[i] = products[i].number;
        count = i;
      }
    console.log("Получение данных из БД");
});


connection.end();
 
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

// Обратите внимание на используемый путь. Именно он задается в атрибуте action формы
app.post('/products_insert', urlencodedParser, function(req, res) {
    // Объект req.body содержит данные из переданной формы
    if (!req.body) return console.log("500");
    console.log(req.body);

    count++;
    productName[count] = req.body.form_productName;
    productNumber[count] = req.body.form_productNumber;

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
		database: "shop_list",
		password: "QAZWSXEDC"
      });

    const sqlInsert = `INSERT INTO products(name, number) VALUES('${req.body.form_productName}', '${req.body.form_productNumber}')`;

    connection.query(sqlInsert, function(err, results) {
    if(err) console.log(err);
    console.log(results);
    });

    req.body = null;

    
    const sqlUp = `SELECT * FROM products`;

    productId = [];
    productName = [];
    productNumber = [];


    console.log("Получение обновленных данных из БД");
    connection.query(sqlUp, function(err, results) {
    if(err) console.log(err);
    var products = results;
    //console.log(results);
    for(let i=0; i < products.length; i++){
        productId[i] = i+1;
        productName[i] = products[i].name;
        productNumber[i] = products[i].number;
        count = i;
      }
      res.render("products", {
        title: "Список покупок",
        productsVisible: true,
        productId,
        productName,
        productNumber
    });
    
    });
    connection.end();
});

app.post('/products_delete', urlencodedParser, function(req, res) {
    // Объект req.body содержит данные из переданной формы
    if (!req.body) return console.log("500");
    console.log(req.body);

    //count--;

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
		database: "shop_list",
		password: "QAZWSXEDC"
      });

    var tName = req.body.form_productName;
    console.log(req.body.form_productId);
    console.log(productName[req.body.form_productId-1]);
    if (req.body.form_productId !== "" && Number(req.body.form_productId) <= count+1 && Number(req.body.form_productId) > 0) { // && req.body.form_productId < count && req.body.form_productId > 0
        
        tName = productName[req.body.form_productId-1];
        console.log(tName);
    }
    
    const sqlDelete = `DELETE FROM products WHERE name='${tName}'`;

    connection.query(sqlDelete, function(err, results) {
    if(err) console.log(err);
    console.log(results);
    });

    req.body = null; 
    //connection.end();

    const sqlUp = `SELECT * FROM products`;

    productId = [];
    productName = [];
    productNumber = [];


    console.log("Получение обновленных данных из БД");
    connection.query(sqlUp, function(err, results) {
    if(err) console.log(err);
    var products = results;
    //console.log(results);
    for(let i=0; i < products.length; i++){
        productId[i] = i+1;
        productName[i] = products[i].name;
        productNumber[i] = products[i].number;
        count = i;
      }
      res.render("products", {
        title: "Список покупок",
        productsVisible: true,
        productId,
        productName,
        productNumber
    });
    
    });
    connection.end();

});

app.post('/products_update', urlencodedParser, function(req, res) {
    // Объект req.body содержит данные из переданной формы
    if (!req.body) return console.log("500");
    console.log(req.body);

    //count--;

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
		database: "shop_list",
		password: "QAZWSXEDC"
      });

    var tName = req.body.form_productName;

    const sqlUpdate = `UPDATE products SET number='${req.body.form_productNumber}' WHERE name='${req.body.form_productName}'`;

    connection.query(sqlUpdate, function(err, results) {
    if(err) console.log(err);
    console.log(results);
    });

    req.body = null; 
    //connection.end();

    const sqlUp = `SELECT * FROM products`;

    productId = [];
    productName = [];
    productNumber = [];


    console.log("Получение обновленных данных из БД");
    connection.query(sqlUp, function(err, results) {
    if(err) console.log(err);
    var products = results;
    //console.log(results);
    for(let i=0; i < products.length; i++){
        productId[i] = i+1;
        productName[i] = products[i].name;
        productNumber[i] = products[i].number;
        count = i;
      }
      res.render("products", {
        title: "Список покупок",
        productsVisible: true,
        productId,
        productName,
        productNumber
    });
    
    });
    connection.end();

});

app.post('/products_sort', urlencodedParser, function(req, res) {
    // Объект req.body содержит данные из переданной формы
    if (!req.body) return console.log("500");
    console.log(req.body);

    //count--;

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
		database: "shop_list",
		password: "QAZWSXEDC"
      });

    var checkOption = '';
    if (req.body.optionName == 'checkName') {
        checkOption = 'name';
        console.log(checkOption);
    }
       
    if (req.body.optionNumber == 'checkNumber')
       checkOption = 'number'

    if (checkOption == '')
      console.log('option was not selected');
    
    req.body = null;

    const sqlUp = `SELECT * FROM products ORDER BY ${checkOption}`;

    productId = [];
    productName = [];
    productNumber = [];


    console.log("Получение обновленных данных из БД");
    connection.query(sqlUp, function(err, results) {
    if(err) console.log(err);
    var products = results;
    //console.log(results);
    for(let i=0; i < products.length; i++){
        productId[i] = i+1;
        productName[i] = products[i].name;
        productNumber[i] = products[i].number;
        count = i;
      }
      res.render("products", {
        title: "Список покупок",
        productsVisible: true,
        productId,
        productName,
        productNumber
    });
    
    });
    connection.end();

});
 
app.use("/", function(request, response){
     
    response.render("products", {
        title: "Список покупок",
        productsVisible: true,
        productId,
        productName,
        productNumber
    });
});


app.use("/", function(request, response){
     
    response.send("Please follow the port 3001!");
});

app.listen(3001, function() {
    console.log("Server was started");
});