var inquirer = require('inquirer');
var mysql = require('mysql');


var connection = mysql.createConnection({
	host: 'localhost',
	port: 3307,


	user: 'root',

	password: '',
	database: 'bamazon_DB'
});

function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

function promptUserPurchase() {

	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID which you would like to purchase.',
			filter: Number,
			validate:validateInput
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many do you need?',
			filter: Number,
			validate:validateInput
		}
	]).then(function (input) {
		var item = input.item_id;
		var quantity = input.quantity;

		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, { item_id: item }, function (err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInventory();

			} else {
				var productData = data[0];

				if (quantity <= productData.stock_quantity) {
					console.log('\n Congratulations, the product you requested is in stock! Placing order!\n');
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

					connection.query(updateQueryStr, function (err, data) {
						if (err) throw err;
						console.log("*******************************************************************************************");
						console.log('Your product is:', productData.product_name + ',' , 'your total is: $' + productData.price * quantity);
						console.log("*******************************************************************************************\n");

						connection.end();
					})
				} else {
					console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
					console.log("*******************************************************************************************\n");

					displayInventory();
				}
			}
		})
	})
}
function displayInventory() {

	queryStr = 'SELECT * FROM products';

	connection.query(queryStr, function (err, data) {
		if (err) throw err;

		console.log('**********************************__Existing Inventory__**********************************\n');
		console.log("*******************************************************************************************\n");


		for (var i = 0; i < data.length; i++) {
			console.log('Item ID: ' + data[i].item_id + '  ||  ' + 'Product Name: ' + data[i].product_name + ' || ' +
			'Department: ' + data[i].department_name + '  ||  ' + 'Price: $' + data[i].price + '\n');
		}

		console.log("*******************************************************************************************\n");

		promptUserPurchase();
	})
}

	displayInventory();

