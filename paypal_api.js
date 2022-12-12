const axios = require("axios");
var qs = require("qs");
require("dotenv").config();
const { PAYPAL_BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

exports.paypalAuth = async () => {
  const data = qs.stringify({
    grant_type: "client_credentials",
    ignoreCache: "true",
    return_authn_schemes: "true",
    return_client_metadata: "true",
    return_unconsented_scopes: "true",
  });
  const config = {
    method: "post",
    url: `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_CLIENT_SECRET,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "Accept-Encoding": "identity",
    },
    data: data,
  };

  return await axios(config);
};

exports.createOrder = async (token, total, intent) => {
  const data = JSON.stringify({
    intent: intent,
    application_context: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      brand_name: "EXAMPLE INC",
      locale: "en-US",
      user_action: "PAY_NOW",
      payment_method: {
        payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        standard_entry_class_code: "TEL",
      },
    },
    purchase_units: [
      {
        amount: {
          currency_code: "CAD",
          value: total,
        },
      },
    ],
  });
  const config = {
    method: "post",
    url: `${PAYPAL_BASE_URL}/v2/checkout/orders`,
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Accept-Encoding": "identity",
    },
    data: data,
  };
  return axios(config);
};

exports.authorizePayment = async (id, token) => {
  try {
    var config = {
      method: "post",
      url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${id}/authorize`,
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
        Authorization: `Bearer ${token}`,
      },
    };
    return axios(config);
  } catch (error) {
    return error;
  }
};

exports.capturePayment = async (id, token) => {
  try {
    var config = {
      method: "post",
      url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${id}/capture`,
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
        Authorization: `Bearer ${token}`,
      },
    };
    return axios(config);
  } catch (error) {
    return error;
  }
};
exports.retrieveOrderDetails = async (id, token) => {
  console.log(id, token, "here");
  try {
    var config = {
      method: "get",
      url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${id}`,
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
        Authorization: `Bearer ${token}`,
      },
    };
    return axios(config);
  } catch (error) {
    return error;
  }
};
