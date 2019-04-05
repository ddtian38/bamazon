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

//Once connected main menu is displayed
connection.connect(
    mainMenu()
)

//function creates main menu
function mainMenu(){
    inquirier
        .prompt([
            {
                name: "command",
                type: "list",
                choices: ["View Product Sales by Department", "Create New Department", "Logout"]
            }
        ]).then(function(ans){
            switch (ans.command){
                case "View Product Sales by Department":
                    viewProductSales();
                    break;
                case "Create New Department":
                    createDepartment();
                    break;
                default:
                    logOut();
            }
        })
}

//Function will display the department table.
function viewProductSales(){
    var query = "SELECT d.department_id, d.department_name, d.over_head_cost, SUM(p.product_sales) as product_sales, SUM(p.product_sales) - d.over_head_cost as total_profit FROM departments d LEFT JOIN products p on d.department_id = p.department_id GROUP BY d.department_id;"
    connection.query(query, function(err, res){
        if(err) throw err;
        let table = [];
        for(var i = 0; i < res.length; i++){
            table.push(
                {
                    department_id: res[i]["department_id"],
                    department_name: res[i]["department_name"],
                    overhead_cost: res[i]["over_head_cost"],
                    product_sales: res[i]["product_sales"],
                    total_profit: res[i]["total_profit"]
                }
            )
        }
        console.log(cTable.getTable(table))
        mainMenu();
    })
};

//Function allows the supervisor to create the departments
function createDepartment(){
    inquirier
        .prompt([
            {
                name:"departmentName",
                message: "What is the name of the new department?",
                validate(value) {return isNaN(value)}
            },
            {
                name:"overheadCost",
                message: "What is overhead cost?",
                validate(value) {return !isNaN(value) && value > 0}
            }

        ]).then(function(ans){
            connection.query("INSERT INTO departments (department_name, over_head_cost) VALUES(\""+ans.departmentName+"\", " +ans.overheadCost+");", function(err, res){
                if(err)throw err;
                mainMenu()
            })
        })

};

//Function logs out of the database.
function logOut(){
    console.log("Logging out of the database.")
    connection.end()
}