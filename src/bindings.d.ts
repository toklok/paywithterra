import type { KV } from "worktop/kv";

export {};

declare global {
  const API_KEY: string;
  const WALLERT_ADDR: string;
  const ORDERS: KV.Namespace;
  const PAID_URL_WEBHOOK: string;
  const RETURN_URL_WEBHOOK: string;
  const DENOM: string;
}
