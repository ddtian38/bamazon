//Installing npms
const mysql = require("mysql");
const inquirier = require("inquirer")
const cTable = require("console.table")

//Creating connectiont to the database

const connection = mysql.createConnection({
    hosts: "localhost",
    user: "root",
    password: "root",
    port: 3306,
    database: "bamazonDB"
})

//Running main program
function main(){
    connection.connect(function(err){
        if(err) throw error;
        mainMenu()
    })
}

//Function creates main menu
function mainMenu(){
    inquirier
        .prompt([
            {
                name:"options",
                message: "Hello fellow customer, what would you like to do?",
                type:"list",
                choices:["BUY AN ITEM", "EXIT"]
            }
        ]).then(function(r){
            if(r.options === "EXIT"){
                console.log("Logging out of database.")
                connection.end();
            }else{
                buyOption();
            }
        })
}


//Function shows the user what is currently avaiable in the inventory and prompts the user what to buy.
function buyOption(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        let table = [];
        for(var i = 0; i < res.length; i++){
            table.push(
                {
                    item_id: res[i]["item_id"],
                    product_name: res[i]["product_name"],
                    department_name: res[i]["department_name"],
                    price: res[i]["price"],
                    stock_quantity: res[i]["stock_quantity"],
                    product_sales: res[i]["product_sales"]
                }
            )
        }
        console.log(cTable.getTable(table))
        promptUser();
    })
}


//Function asks the user what to buy
function promptUser(){
    inquirier
        .prompt([
            {
                name: "itemID",
                message: "What item would you like to order? (Please input ID of the item)",
                validate(value){
                    return !isNaN(value) && value > 0
                }
            },
            {
                name: "amount",
                message: "How many items would you like to buy?",
                validate(value){
                    return !isNaN(value) && value > 0
                }
            }
        ]).then(function(ans){
            isAvaiable(ans.itemID, ans.amount)
        })
}

//Function checks if there is enough of the produt in stock.
function isAvaiable(id, amount){
    connection.query(`
    SELECT * FROM products WHERE ?`,
    {
        item_id: id
    },
    function(err, res){
        if(res.length > 0){
            if(res[0]["stock_quantity"] >= amount){
                console.log("Buying product");
                fulfillOrder(id, amount)
            }else{
                console.log("Insufficent quantity");
                mainMenu();
            }

        }else{
            console.log("Such an item does not exist.")
            mainMenu();
        }

    }
    )
}

//function completes the buy option. The amount that the user buys will be subtracted from the current inventory. Profit is calculated.
function fulfillOrder(id, amount){
    connection.query(
        `SELECT stock_quantity, price, product_sales FROM products WHERE ?`, [{
            item_id: id
        }], function(err,res){
            if(err) throw err;
            let price = res[0]["price"];
            let currentAmount = parseInt(res[0]["stock_quantity"]);
            let productSales = parseFloat(res[0]["product_sales"]);

            let profit = parseInt(amount)*parseFloat(price);
        

            productSales += profit;
            currentAmount -= parseInt(amount);

        
        connection.query(
            ` UPDATE products SET ? WHERE ?`,[{stock_quantity: currentAmount, product_sales: productSales}, {item_id: id}], function(err,res){
                console.log("Your order has been procressed. The total cost will be $" + profit +".");
                connection.query("SELECT * FROM products", function(err, res){
                    if(err) throw err;
                    let table = [];
                    for(var i = 0; i < res.length; i++){
                        table.push(
                            {
                                item_id: res[i]["item_id"],
                                product_name: res[i]["product_name"],
                                department_name: res[i]["department_name"],
                                price: res[i]["price"],
                                stock_quantity: res[i]["stock_quantity"],
                                product_sales: res[i]["product_sales"]
                            }
                        )
                    }
                    console.log(cTable.getTable(table))
                    mainMenu();
                })
                
            })
        
        }
        )
}

//Running main program
main();