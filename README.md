# bamazon

In this program, Bamazon is an Amazon-like storefront and it was used through MySQL and Node JS. The app will take in orders from customers and deplete stock from the store's inventory. As a bonus task, the program will also track product sales across the store's departments and then provide a summary of the highest-grossing departments in the store.

## Technologies:
    Node.js
    MySQL
    inquirier NPM
    mysql NPM


# bamazonCustomer.js

This Javascript app allows the user to purchase any item that is shown in the database. A table is shown for the current inventory and the user selects the item by its ID to purchase and how many he or she wants. If there is enough in the inventory to complete the customer's order, the amount will be deducted from the database; if not, the user will be notified there is not enough. The program computes how much the customer needs to pay and the payment is then added to the product sales column.

Here's the video of the link:

https://youtu.be/Bd7j8h5k4to


# bamazonManager.js

This Javascript app gives the manager four options: to see all the inventory, see which inventories are low, add more to the current selection, or add a new item. One challenging tasks for this app was to assign a department ID for the new item. In the departments table, each department has a unique ID. In order for the manager to add an item to a new department, the supervisor would have to first create the department in the department table. In the addInventory function, the program will run a query to see if the department that the manager has inputted exists. If so, the item will be successfully added; if not, the manager is advised to contact the supervisor.

Here's the video of the link:

https://youtu.be/LdkjrDMmeTw

# bamazonSupervisor.js

This Javascript app gives the supervisor to view the current product sales in each department and to create a new department.  In the viewProductSales function, an inner join based on the department ID was used between the products and departments table. Initially, the tables were joined based on the department_name column, but there was difficulty to consolidate the product_sales column for several products that were in the same department. With the join, the new table would show two seperate rows of the same department with different values in the product_sales column. The total_profit was calculated by taking the difference between the product_sales and over_head_cost columns. 

Here's the video of the link:

https://youtu.be/AWIKp7K2lTU
