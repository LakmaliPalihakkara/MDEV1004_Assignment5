const express = require("express");
const paypal = require("paypal-rest-sdk");
const app = express();
app.use(express.static('public'));

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AQJ_57csqP9PoJDA1cho0VlXWYjsIkYGVXe0GnAdoSf0Qt8redbghRniRr5vWPfHAG4WcXqB-G-IZJOz",
  client_secret:
    "EEEl6lbiMyeLGXC0v3wwZ6z1cLHk0e45VQOSDSs-gLRzUQxd50Vsd-G63Xe9h1Z7_BjNYKZe2IZrLMWi",
});

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

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
              price: "50.00",
              currency: "CAD",
              quantity: 10,
            },
          ],
        },
        amount: {
          currency: "CAD",
          total: "500.00",
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

app.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "5.00",
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (
    error,
    payment
  ) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      console.log(JSON.stringify(payment));
      res.send("Success");
    }
  });
});

app.get("/cancel", (req, res) => res.send("Cancelled"));

app.listen(PORT, () => console.log(`Server Started on ${PORT}`));
