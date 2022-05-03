import * as Model from "./model";
import type { Order } from "./model";
import type { Handler } from "worktop";

/**
 * POST /create
 */

export const order: Handler = async function (req, res) {
  const input = await req.body<Order>();
  const order = await fetch("https://paywithterra.com/api/order/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      address: WALLERT_ADDR,
      memo: input.memo,
      webhook: PAID_URL_WEBHOOK,
      webhook_json: true,
      amount: Number(input.amount),
      denom: DENOM,
      return_url: RETURN_URL_WEBHOOK,
    }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return {
        error: true,
      };
    }
  });

  const result = await Model.insert(order.uuid, { ...order });

  if (result) res.send(201, result, { "Content-Type": "application/json" });
  else res.send(500, "ERROR");
};

/**
 * POST /paid
 */

export const paid: Handler = async (req, res) => {
  const input = await req.body<Order>();
  const result = await Model.update(input.uuid, { ...input });

  if (result) res.send(201, result, { "Content-Type": "application/json" });
  else res.send(500, "ERROR");
};
