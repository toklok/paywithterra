import { Router, listen } from "worktop";
import { order, paid } from "./routes";
import * as CORS from "worktop/cors";

const API = new Router();

API.prepare = CORS.preflight({
  origin: "https://terra.joecurt.workers.dev", // allow only this origin
  headers: ["Cache-Control", "Content-Type", "X-Count"],
  methods: ["GET", "POST"],
});

API.add("POST", "/create", order);

API.add("POST", "/paid", paid);
/**
 * send main HTML page
 */
API.add("GET", "/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.end(`
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Terra Form</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Questrial&amp;display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/gh/paywithterra/buttons@0.1.2/public/css/pwt-buttons.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">
    </head>
    <body>
    <form>
    <legend>Pay with Terra</legend>
    <label for="memo">Enter in a memo: </label>
    <input id="memo" type="text" default="memo">
    <label for="amount">Enter in a ammount in USD: </label>
    <input id="amount" type="number" default="9.99">
    <button type="submit" id="submitBtn" class="btn-pay-with-terra pwt-dark">
        <span class="pwt-label-text">Buy with</span>
        <span class="pwt-logo"></span>
        <span class="pwt-label-terra">Terra</span>
        <span class="pwt-label-denom">$UST</span>
    </button>
    </form>
    <script>
        const btnSubmit = document.getElementById("submitBtn");
        const memoNote = document.getElementById("memo").value;
        const amountUSD = document.getElementById("amount").value * 1000000;
    
        btnSubmit.addEventListener("click", async function (evt) {
            evt.preventDefault();
            await fetch("/create", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "memo": document.getElementById("memo").value,
                    "amount": document.getElementById("amount").value * 1000000
                })
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
            }).then((data) => {
                const redirect = data.uuid;
                window.location.href = 'https://paywithterra.com/pay/\' + redirect + \'';
            })
        });
    </script>
    </body>
    </html>`);
});

/**
 * send return_url HTML page
 */
API.add("GET", "/thanks", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.end(`
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Thanks</title>
    </head>
    <body>
       <h1>Thanks</h1>
    </body>
    </html>
    `);
});

listen(API.run);
