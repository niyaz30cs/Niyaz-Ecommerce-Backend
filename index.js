const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require("./Routing/userRoute");
const productRoute = require("./Routing/productRoute");
const { Connection, connection } = require("./config/db");
dotenv.config();
const port = process.env.port

app.use(express.json());
app.use(cors({
    origin: "*"
}));



app.use("/user",userRoute);
app.use(productRoute);


const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET} = process.env;
const base = "https://api-m.sandbox.paypal.com";
  
const Token = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.error("Failed to generated Access Token:", err);
  }
};
const makeOrder = async ({TotalAmount}) => {
  const accessToken = await Token();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value:TotalAmount,
        },
      },
    ],
};
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  console.log("ACCESS TOKEN CALLED")
  
  return handleResponse(response);
};
async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      StatusCode: response.status,
    };
  } catch (err) {
    const Error = await response.text();
    throw new Error(Error);
  }
}; 
app.post("/api/orders", async (req, res) => {
  try {
    const { cart,TotalAmount } = req.body;
    const { jsonResponse,StatusCode } = await makeOrder({cart,TotalAmount});
    res.status(StatusCode).json(jsonResponse);
  } catch (err) {
    console.error("Order Failed..:", err);
    res.status(500).json({ error: "Order Failed..." });
  }
});
app.listen(port, async () => {
    try {
        await connection();
        console.log("Server Run on Port No-1010");
    } catch (err) {
        console.log(`Some Error on Port No-,${err}`)
    }
});

