const express = require("express");
const paypal = require("paypal-rest-sdk");
const paypalcheckout = require("@paypal/checkout-server-sdk");
const { response } = require("express");
const app = express();
app.use(express.static("public"));

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AQJ_57csqP9PoJDA1cho0VlXWYjsIkYGVXe0GnAdoSf0Qt8redbghRniRr5vWPfHAG4WcXqB-G-IZJOz",
  client_secret:
    "EEEl6lbiMyeLGXC0v3wwZ6z1cLHk0e45VQOSDSs-gLRzUQxd50Vsd-G63Xe9h1Z7_BjNYKZe2IZrLMWi",
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
//// Orders API calls start
app.post("/paycheck", (req, res) => {
  //console.log(document.getElementById("title").innerHTML);

  // This sample uses SandboxEnvironment. In production, use LiveEnvironment
  let environment = new paypalcheckout.core.SandboxEnvironment(
    "AQJ_57csqP9PoJDA1cho0VlXWYjsIkYGVXe0GnAdoSf0Qt8redbghRniRr5vWPfHAG4WcXqB-G-IZJOz",
    "EEEl6lbiMyeLGXC0v3wwZ6z1cLHk0e45VQOSDSs-gLRzUQxd50Vsd-G63Xe9h1Z7_BjNYKZe2IZrLMWi"
  );
  let client = new paypalcheckout.core.PayPalHttpClient(environment);

  // Construct a request object and set desired parameters
  // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
  let request = new paypalcheckout.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    redirect_urls: {
      return_url: "https://localhost:3000/paypalnode.com/success",
      cancel_url: "https://localhost:3000/paypalnode.com/createordercancel",
    },
    purchase_units: [
      {
        amount: {
          currency_code: "CAD",
          value: "1.00",
        },
      },
    ],
  });
  // Call API with your client and get a response for your call
  let createOrder = async function () {
    let response = await client.execute(request);
    //res.redirect("www.sandbox.paypal.com/checkoutnow?token=7MC59059SW679454J");
    https: console.log(`Response: ${JSON.stringify(response)}`);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    console.log(`Order: ${JSON.stringify(response.result)}`);
  };
  createOrder();
  res.redirect(
    "https://www.sandbox.paypal.com/checkoutnow?token=5TC617641M705800Y"
  );
});

app.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const order_id = "14104455YB194530K";

  let captureOrder = async function (orderId) {
    request = new paypalcheckout.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    // Call API with your client and get a response for your call
    let response = await client.execute(request);
    console.log(`Response: ${JSON.stringify(response)}`);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    console.log(`Capture: ${JSON.stringify(response.result)}`);
  };

  let capture = captureOrder("14104455YB194530K");
});
//// End Orders api logic
app.post("/fetchorder", (req, res) => {
  let details = paypalcheckout.orders.OrdersGetRequest(orderId);
  let response = client.execute(request);
  console.log(`Response: ${JSON.stringify(response)}`);
});

app.post("/pay", (req, res) => {
  const create_payment_json = {
    intent: "Sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "https://localhost:3000/paypalnode.com/success",
      cancel_url: "https://localhost:3000/paypalnode.com/cancel",
    },
    transactions: [
      {
        books_list: {
          books: [
            {
              name: "Mobile Data Mangement",
              Author: "Shivali Dhaka",
              price: "1.00",
              currency: "CAD",
              quantity: 10,
            },
          ],
        },
        amount: {
          currency: "CAD",
          total: "1.00",
        },
        description: "Mobile Data Managemnt course Book",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

/*app.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "CAD",
          total: "1.00",
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        res.send("Success");
      }
    }
  );
});*/

app.get("/cancel", (req, res) => res.send("Cancelled"));

app.listen(PORT, () => console.log(`Server Started on ${PORT}`));
