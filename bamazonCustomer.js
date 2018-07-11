var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
   
    connection.query("SELECT item_id, product_name, price FROM products WHERE stock_quantity>0", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
          }
          console.log("-----------------------------------");
          start();
      });

  });


function writeDB (item,howmany){
    var newstock;
    connection.query("SELECT * FROM products WHERE item_id=?",[item], function(err, res) {
        if (err) throw err;
        newstock = res[0].stock_quantity - howmany;
        console.log("new stok "+newstock);
          connection.query("UPDATE products SET stock_quantity = ? WHERE item_id=?",[newstock,item],
        function(err) {
          if (err) throw err;
          console.log("Congratulations Your Order is on the way ");
          start();
        }
      );
    });
}

  function start() {
    inquirer
      .prompt({
        name: "buy",
        type: "input",
        message: "What Item would you like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
      })
      .then(function(answer) {
          var name;
          connection.query("SELECT * FROM products WHERE item_id=?",[answer.buy], function(err, res) {
            if (err) throw err;
            name = res[0].product_name; 
            inquirer
                .prompt({
                    name: "howmany",
                    type: "input",
                    message: "Hoy many "+ name +" do you want to buy",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                        return true;
                        }
                        return false;
                    }
                })
                .then(function(answer2) {
                   var howmany = answer2.howmany;
                        if (err) throw err;
                        if (res[0].stock_quantity >= howmany){
                            writeDB(res[0].item_id,howmany);
                        } else {
                            console.log("Insufficient quantity!");
                            start ();
                        }
                        
          });
        });
      });
  }
