var inquirer = require('inquirer');
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,


    user: 'root',

    password: '',
    database: 'bamazon_DB'
});

function validate(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole non-zero number.';
    }
};

function promptManager() {
    inquirer.prompt([
        {
            name: "selection",
            message: "What would you like to do?",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "QUIT"]
        }]).then(function (answers) {
            if (answers.selection === "View Products for Sale") {
                displayInventory();
            }
            else if (answers.selection === "View Low Inventory") {
                displayLowInventory();
            } else if (answers.selection === "Add to Inventory") {
                addInventory();
            } else if (answers.selection === "Add New Product") {
                addNewProduct();
            }
            else if (answers.selection === "QUIT") {
                connection.end();
            }
        });
};

function displayLowInventory() {
    queryDb = 'SELECT * FROM products';
    connection.query(queryDb, function (err, data) {
        if (err) throw err;
        
        var inventoryUpdated = true;
        for (var i = 0; i < data.length; i++) {
            if (data[i].stock_quantity < 5) {
                console.log("\n*******************************************************************************************\n");         
                console.log('Item ID: ' + data[i].item_id + '  ||  ' + 'Product Name: ' + data[i].product_name + ' || ' +
                    'Department: ' + data[i].department_name + '  ||  ' + 'Price: $' + data[i].price + ' || ' + 'Inventory count: ' + data[i].stock_quantity + '\n');
                
                inventoryUpdated = false;
            }
        }

        if(inventoryUpdated){
            console.log("\n*******************************************************************************************\n");
            console.log("Enough inventory!!\n");
        }
        
        console.log("*******************************************************************************************\n");
        promptManager();
    })
};

function addInventory() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Please enter ID of the product which you would like to add',
            filter: Number,
            validate: validate
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many do you want to add?',
            filter: Number,
            validate: validate
        }
    ]).then(function (input) {
        var item = input.item_id;
        var quantity = input.quantity;

        var queryDb = 'SELECT * FROM products WHERE ?';

        connection.query(queryDb, { item_id: item }, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid product ID.');
                displayInventory();

            } else {
                var productDb = data[0];

                var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productDb.stock_quantity + quantity) + ' WHERE item_id = ' + item;
                connection.query(updateQueryStr, function (err, data) {
                    if (err) throw err;

                    console.log('Your updated product is:', productDb.product_name + ',', 'updated inventory: ', productDb.stock_quantity + quantity);
                    console.log("*******************************************************************************************\n");


                    connection.end();
                })
            }
        })
    })
}

function addNewProduct() {
    inquirer.prompt([
        {
            name: "department_name",
            message: "What kind of department would you like to add?"

        },
        {
            name: "product_name",
            message: "What is the product name?"
        },
        {
            name: "price",
            message: "What's the Price?"
        },
        {
            name: "stock_quantity",
            message: "How many would you like to add?"
        }
    ]).then(function (response) {
        var department = response.department_name;
        var product = response.product_name;
        var price = response.price;
        var quantity = response.stock_quantity;
        connection.query("INSERT INTO products SET ?",
            {
                department_name: department,
                product_name: product,
                price: price,
                stock_quantity: quantity
            },

            function (err, res) {

                console.log("**********************************************************");
                console.log("\n Department name: " + department + " || " + "Product name: " + product +
                    " || " + "Price: " + price + " || " + "Quantity: " + quantity + " inserted!\n");
                console.log("**********************************************************");
                promptManager();
            })


    });
}

function displayInventory() {

    queryDb = 'SELECT * FROM products';

    connection.query(queryDb, function (err, data) {
        if (err) throw err;

        console.log('\n**********************************__Existing Inventory__**********************************\n');
        console.log("*******************************************************************************************");

        for (var i = 0; i < data.length; i++) {
            var table = data[i];
            console.log('Item ID: ' + table.item_id + '  ||  ' + 'Product Name: ' + table.product_name + ' || ' +
                'Department: ' + table.department_name + '  ||  ' + 'Price: $' + table.price + ' || ' + 'Quantity: ' + table.stock_quantity);
        }
        console.log("*******************************************************************************************\n");

        promptManager();
    })
}

promptManager();