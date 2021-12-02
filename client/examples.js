//examples of scenarios implementation using

const channels = import('./menus/client.js');

const client = channels.then((result) => result.Client('http://localhost:8080'));

//Scenario 1: Display the menu.
client.then((obj) => {
      console.log('Scenario 1');
      console.log('Available menu:');
      return obj.listMenu();
    }).then((result) => console.log(result))
    .catch((e) => {
        console.log(`Problem listing available menu: ${e.message}`);
    });

// Scenario 2: Creating an order.

client.then((obj) => {
         const createOrder = obj.createOrder(0,1); // outputing order 0, 1
         console.log('Scenario 2');
         console.log('Creating an order from menu:');
         createOrder.then((result) => console.log(result))
     })
     .catch((e) => {
         console.log(`Problem creating a new order: ${e.message}`);
     });
