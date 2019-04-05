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
                type:"list",
                message:"Hello manager, what would you like to do?",
                name:"option",
                choices:["View Products for Sale", "View Low Inventory", "Add to Inventory",
            "Add New Product", "Logout"]
            }
        ])
        .then(function(r){
            switch (r.option){
                case "View Products for Sale":
                    viewProducts();
                break;
                case "View Low Inventory":
                    lowInventory();
                break;
                case "Add to Inventory":
                    addInventory();
                break;                
                case "Add New Product":
                    addProduct();
                break;
                case "Logout":
                    console.log("Logging out of databases.")
                    connection.end();
                break;
                
            }
        })
}


//function takes a query statement of selecting all columns and dsplays the table
function displayTable(query){
    connection.query(query, function(err,res){
        if(res.length > 0){
            let table = [];
            for(var i = 0; i < res.length; i++){
                table.push(
                    {
                        item_id: res[i]["item_id"],
                        product_name: res[i]["product_name"],
                        department_name: res[i]["department_name"],
                        price: res[i]["price"],
                        stock_quantity: res[i]["stock_quantity"]
                    }
                )
            }
            console.log(cTable.getTable(table))
            mainMenu();
        }

    })
}

//Function will show all products in the inventory
function viewProducts(){
    let query = "SELECT * FROM products";
    displayTable(query)
}

//Function will show products in the inventory that have less than five in stock.
function lowInventory(){
    let query = 'SELECT * from products WHERE stock_quantity < 5';
    displayTable(query);
}


//Function adds more existing products to the inventory 
function addInventory(){
    inquirier
        .prompt([
            {
                name: "itemID",
                message: "What item would you like to add more to? (Please input ID of the item)",
                validate(value){
                    return !isNaN(value) && value > 0
                }
            },
            {
                name: "amount",
                message: "How many would you like to add?",
                validate(value){
                return !isNaN(value) && value > 0
                }
            }
        ]).then(function(r){
                fullfillCommand(r.itemID, r.amount)
        })
}

function fullfillCommand(id,amount){
    connection.query(
        `SELECT product_name, stock_quantity FROM products WHERE ?`, [{
            item_id: id
        }], function(err,res){
            if(err) throw err;
            let productName = res[0].product_name;
            let currentAmount = parseInt(res[0].stock_quantity);
            currentAmount += parseInt(amount);
        
        connection.query(
            ` UPDATE products SET ? WHERE ?`,[{stock_quantity: currentAmount}, {item_id: id}], function(err,res){
                if(err) throw err;
                console.log("Adding " + amount + " to " + productName + ".");
                displayTable("SELECT * FROM products");
            })
        
        }
        )
}

//Function adds new item to the inventory, allowing manager to write the name of the product, which department it exists, the price of the product, and how many in the stock quantity.
function addProduct(){
    inquirier
        .prompt([
            {
                name:"productName",
                message: "What is the name of the product?"
            },
            {
                name:"department",
                message: "What department is the product in?"
            },
            {
                name:"price",
                message: "What is the price of the product?",
                validate(value){
                    return !isNaN(value) && value > 0;
                }
            },
            {
                name:"stockQuantity",
                message: "How much would you like to?",
                validate(value){
                    return !isNaN(value) && value > 0;
                }
            }
        ]).then(function(r){
            //Checks if the department already exists. If it does exist, product will be added. If not, manager is advised to contact the supervisor to add one.
            connection.query("select department_id from departments where department_name = \""+r.department+"\";",function(err,res){
                if(res.length > 0){
                    let deptID = res[0]["department_id"]
                    let productName = r.productName;
                    let department = r.department;
                    let price = parseFloat(r.price);
                    let stockQuantity = parseInt(r.stockQuantity)
                    let query = "INSERT INTO products (product_name, department_name, price, stock_quantity, department_id) VALUES(\"" +productName + "\", \"" + department + "\", \"" + price + "\", \"" +stockQuantity + "\", \""+deptID+"\");";
                    connection.query(query, function(err,res){
                                if(err)throw err;
                                console.log(res)
                                mainMenu();
                    })
                }else{
                    console.log("The department does not exist. Please contact supervisor.") 
                    mainMenu();
                }

            })

        })

}

main();