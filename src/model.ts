import * as DB from "worktop/kv";

export interface Order {
  memo: string | null;
  uuid: string | null;
  amount: number | null;
  denom: string;
  complete: boolean;
  is_payed: boolean | number;
  created_at: string;
  updated_at: string;
  tx_link: string;
}

/**
 * Save order
 */
export function save(order: string, item: Partial<Order>) {
  return DB.write(ORDERS, order, item);
}

/**
 * Find Order
 */
export function find(order: string) {
  return DB.read<Order>(ORDERS, order, "json");
}

/**
 * Insert order
 */
export async function insert(order: string, item: Partial<Order>) {
  try {
    const values: Order = {
      memo: item.memo || "",
      uuid: item.uuid || "",
      is_payed: false,
      amount: Number(item.amount) || 0,
      denom: "uusd",
      complete: false,
      created_at: item.created_at || "",
      updated_at: item.updated_at || "",
      tx_link: item.tx_link || "",
    };
    if (!(await save(order, values))) return;
    return values;
  } catch (err) {
    //void
  }
}

/**
 * Update order
 */
export async function update(order: string, item: Partial<Order>) {
  const isPayed = 1 === Number(item.is_payed) ? true : false;
  const values = {
    complete: isPayed,
    ...item,
  };
  const success = await save(order, values);
  if (success) return values;
}

/**
 * Delete order
 */
export function destory(order: string) {
  return DB.remove(ORDERS, order);
}
