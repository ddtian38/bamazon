const mysql = require("mysql");
const inquirier = require("inquirer")
const cTable = require("console.table")

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

function mainMenu(){
    inquirier
        .prompt([
            {
                type:"list",
                message:"Hello manager, what would you like to do?",
                name:"option",
                choices:["View Products for Sale", "View Low Inventory", "Add to Inventor",
            "Add New Product"]
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
                case "Add to Inventor":
                    addInventory();
                break;                
                case "Add New Product":
                    addProduct();
                break;
                
            }
        })
}

function displayTable(query){
    connection.query(query, function(err,res){
        if(err) throw err;
        let table = [];
        console.log(res[0]["item_id"])
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
    })
}


function viewProducts(){
    let query = "SELECT * FROM products";
    displayTable(query)




}

function lowInventory(){
    let query = 'SELECT * from product GROUP BY product_name HAVING COUNT(*) < 5';
    displayTable(query)

}

function addInventory(){

}

function addProduct(){

}