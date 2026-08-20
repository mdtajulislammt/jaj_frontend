# ElectroPOS — Frontend

A frontend-only Next.js console for an electronics/superstore retail POS, built from your
Bengali business-flow spec: PO → GRN (IMEI capture) → Inventory → POS billing (split/due
payment) → Sales Return → RTV.

## Stack
- **Next.js 14** (App Router, JavaScript)
- **Redux Toolkit** for state
- **redux-persist** (localStorage) — refresh the page and your data stays
- **Tailwind CSS** — custom light-blue / black / white theme
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (IMEI/prices)

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What's inside

| Route | Purpose |
|---|---|
| `/` | Dashboard — today's sales, due, low stock, GRN pending |
| `/pos` | POS terminal — scan/search, IMEI-serialized cart, split payment (cash/card/bKash-Nagad), due |
| `/products` | Catalog — category/brand/variant, warranty rules, expandable IMEI list, add product |
| `/inventory` | Branch-wise real-time stock, in-stock/sold/damage breakdown |
| `/purchase-orders` | Create PO, status pipeline draft → approved → GRN pending → received → closed |
| `/grn` | Receive against a PO, bulk-paste IMEI/Serial numbers, updates inventory |
| `/customers` | Ledger, credit limit, due settlement, loyalty points |
| `/suppliers` | Vendor profiles, accounts payable |
| `/returns` | Sales return/exchange → damage, and Return-to-Vendor (RTV) challans |
| `/reports` | Sales by brand, warranty claims by brand, stock aging (fast vs slow moving) |
| `/settings` | VAT/tax, invoice prefix, printer format, branches, RBAC roles |

## Notes
- All data is seeded mock data (Samsung/Sony/Apple/Xiaomi/Walton/LG) matching the spec's example flow.
- Since this is frontend-only, "backend" actions (checkout, GRN receiving, PO status changes,
  returns) update Redux state directly — swap these dispatches for real API calls when you
  wire up a backend.
- Everything persists to the browser's localStorage via redux-persist, so a refresh won't
  lose your demo data. Clear site data / localStorage to reset to the seed state.
