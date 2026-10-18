"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  X,
  Printer,
  RotateCcw,
  RefreshCw,
  LogOut,
  ChevronDown,
  Package,
  Receipt,
  ShieldCheck,
  LayoutGrid,
  List,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import {
  addLine,
  removeLine,
  setCustomer,
  clearCart,
  setQty,
  updateLine,
} from "@/store/slices/cartSlice";
import { createInvoice } from "@/store/slices/salesSlice";
import { adjustDue } from "@/store/slices/customersSlice";
import { resetToDemo } from "@/store/slices/productsSlice";

/* ─── Style tokens (Dynamic CSS variables) ───────── */
const P_COLOR = "var(--primary, #64BD0B)";
const P_HOVER = "var(--primary-hover, #529E08)";
const P_DARK = "var(--primary-dark, #3B7506)";
const P_LIGHT = "var(--primary-light, #84DB1B)";
const P_DIM = "var(--primary-dim, #EBF8DC)";
const P_DIM_SUBTLE = "var(--primary-dim-subtle, #F6FCF1)";

const TH = {
  padding: "7px 8px",
  textAlign: "center",
  fontSize: 12,
  fontWeight: 700,
  color: "#1a2e44",
  whiteSpace: "nowrap",
  borderRight: "1px solid #c8d8e8",
  background: P_DIM,
  userSelect: "none",
};
const TD = {
  padding: "5px 7px",
  textAlign: "center",
  fontSize: 13,
  color: "#1a2e44",
  verticalAlign: "middle",
  borderRight: "1px solid #eaf0f8",
};
const CELL_IN = {
  border: "1px solid #b8cce0",
  borderRadius: 3,
  padding: "3px 5px",
  fontSize: 12,
  width: 54,
  outline: "none",
  textAlign: "center",
  background: "#fff",
  color: "#1a2e44",
};
const QTY_BTN = {
  background: P_DIM,
  border: "1px solid #b8cce0",
  borderRadius: 3,
  width: 22,
  height: 22,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  fontWeight: 700,
  color: "#1a2e44",
  padding: 0,
  flexShrink: 0,
};
const R_IN = {
  border: "1px solid #c8d8e8",
  borderRadius: 3,
  padding: "4px 8px",
  fontSize: 12,
  width: 76,
  outline: "none",
  textAlign: "right",
  background: "#f7fafd",
  color: "#1a2e44",
};
const R_SEL = {
  border: "1px solid #c8d8e8",
  borderRadius: 3,
  padding: "3px 4px",
  fontSize: 11,
  outline: "none",
  background: "#f7fafd",
  color: "#1a2e44",
};
const ACT_BTN = {
  color: "#fff",
  border: "none",
  padding: "7px 18px",
  fontSize: 18,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
};

/* ── Number to Words converter for BDT ── */
function numberToWords(num) {
  if (!num || isNaN(num) || num <= 0) return "Zero Taka Only";
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convert(n) {
    if (n < 20) return a[n];
    const digit = n % 10;
    if (n < 100) return b[Math.floor(n / 10)] + (digit ? " " + a[digit] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 !== 0 ? " and " + convert(n % 100) : "")
      );
    if (n < 100000)
      return (
        convert(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 !== 0 ? " " + convert(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        convert(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 !== 0 ? " " + convert(n % 100000) : "")
      );
    return (
      convert(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 !== 0 ? " " + convert(n % 10000000) : "")
    );
  }
  return convert(Math.round(num)) + " Taka Only";
}

/* ── Barcode SVG Component ── */
function BarcodeSVG({ value }) {
  const bars = [
    3, 7, 11, 13, 17, 21, 23, 27, 31, 35, 38, 43, 46, 49, 55, 59, 63, 67, 71,
    76, 79, 84, 88, 93, 96, 100, 105, 109, 113, 117, 123, 127, 131, 135, 141,
    146, 151,
  ];
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg
        height="38"
        width="160"
        viewBox="0 0 160 38"
        style={{ shapeRendering: "crispEdges" }}
      >
        {bars.map((x, i) => (
          <rect
            key={i}
            x={x}
            y="0"
            width={i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1.2}
            height="34"
            fill="#1a1a1a"
          />
        ))}
      </svg>
      <span
        style={{
          fontSize: 9,
          fontFamily: "monospace",
          letterSpacing: 1.5,
          marginTop: 1,
          color: "#444",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════ */
export default function PosPage() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.items);
  const customers = useSelector((s) => s.customers.items);
  const cart = useSelector((s) => s.cart);

  const [query, setQuery] = useState("");
  const [showZero, setShowZero] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [pay, setPay] = useState({ cash: 0, card: 0, mfs: 0 });
  const [cardType, setCardType] = useState("Visa");
  const [mfsType, setMfsType] = useState("Bkash");
  const [discPct, setDiscPct] = useState(0);
  const [discTk, setDiscTk] = useState(0);
  const [lastInvoice, setLastInvoice] = useState(null);
  const searchRef = useRef(null);

  /* ── Customer search state (Default to Walk-in Customer) ── */
  const [cusSearch, setCusSearch] = useState("Walk-in Customer");
  const [cusDropOpen, setCusDropOpen] = useState(false);
  const cusRef = useRef(null);

  const categories = useSelector((s) => s.products.categories) || [];
  const [viewMode, setViewMode] = useState("table"); // Default to "table" (List view)
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Auto-sync 20 demo products if browser rehydrated an old cache
  useEffect(() => {
    if (products.length < 20 || products.some((p) => !p.image || !p.image.startsWith("http"))) {
      dispatch(resetToDemo());
    }
  }, [products, dispatch]);

  // Ensure Walk-in Customer is set by default in cart
  useEffect(() => {
    const walkCust = customers.find(
      (c) => c.name.toLowerCase().includes("walk") || c.id === "cus-003"
    );
    if (walkCust && !cart.customerId) {
      dispatch(setCustomer(walkCust.id));
    }
  }, [customers, cart.customerId, dispatch]);

  /* ── All products filtered for Card Grid ── */
  const displayProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const inStock = p.serials
        ? p.serials.filter((s) => s.status === "in_stock").length
        : p.stock || 0;
      if (inStock === 0 && !showZero) return false;
      if (selectedCategory !== "all" && p.categoryId !== selectedCategory)
        return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.variant && p.variant.toLowerCase().includes(q))
      );
    });
  }, [products, query, showZero, selectedCategory]);

  /* ── Search Dropdown ── */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.barcode && p.barcode.includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)),
      )
      .slice(0, 8);
  }, [products, query]);

  /* ── Per-line calc ── */
  const lineCalcs = cart.lines.map((l) => {
    const prod = products.find((p) => p.id === l.productId);
    const image = l.image || prod?.image || "";
    const variant = l.variant || prod?.variant || "";
    const disc = l.price * ((l.discountPct || 0) / 100);
    const net = l.price - disc;
    const base = net * l.qty;
    const vatAmt = base * ((l.vat || 0) / 100);
    const subTotal = base + vatAmt;
    return { ...l, image, variant, base, vatAmt, subTotal };
  });

  const totalQty = lineCalcs.reduce((s, l) => s + l.qty, 0);
  const totalItems = lineCalcs.length;
  const baseTotal = lineCalcs.reduce((s, l) => s + l.base, 0);
  const vatAmount = lineCalcs.reduce((s, l) => s + l.vatAmt, 0);
  const grossTotal = baseTotal + vatAmount;
  const grossRound = Math.round(grossTotal);
  const finalDisc = discTk > 0 ? discTk : (grossRound * discPct) / 100;
  const finalTotal = Math.max(0, grossRound - finalDisc);
  const paidTotal = pay.cash + pay.card + pay.mfs;
  const changeAmt = paidTotal - finalTotal;
  const customer = customers.find((c) => c.id === cart.customerId);

  /* ── Add product ── */
  function addProduct(p) {
    const inStock = p.serials
      ? p.serials.filter((s) => s.status === "in_stock").length
      : p.stock || 0;
    if (inStock === 0 && !showZero) return;
    const existing = cart.lines.find((l) => l.productId === p.id);
    if (existing) {
      dispatch(setQty({ key: existing.key, qty: existing.qty + 1 }));
    } else {
      dispatch(
        addLine({
          key: `${p.id}-${Date.now()}`,
          productId: p.id,
          name: p.name,
          image: p.image || "",
          variant: p.variant || "",
          group: p.brand || "—",
          stock: inStock,
          price: p.sellPrice,
          qty: 1,
          vat: 0,
          discountPct: 0,
          noOfBox: 0,
        }),
      );
    }
    setQuery("");
    setShowDrop(false);
  }

  function handleCardDecrement(pId) {
    const existing = cart.lines.find((l) => l.productId === pId);
    if (!existing) return;
    if (existing.qty <= 1) {
      dispatch(removeLine(existing.key));
    } else {
      dispatch(setQty({ key: existing.key, qty: existing.qty - 1 }));
    }
  }

  /* ── Checkout ── */
  function handleCheckout() {
    if (!cart.lines.length) return;
    const due = Math.max(0, finalTotal - paidTotal);
    const invoiceId = `INV-${88232 + Math.floor(Math.random() * 500)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const payload = {
      id: invoiceId,
      invoiceNo: `AID${Math.floor(10000000 + Math.random() * 90000000)}`,
      date: formattedDate,
      time: formattedTime,
      customerId: cart.customerId,
      customerName: customer?.name || "Walk-in Customer",
      customerPhone:
        customer?.phone && customer.phone !== "N/A"
          ? customer.phone
          : "0197772722",
      customerEmail: customer?.email || "tajul@gmail.com",
      customerAddress:
        customer?.address && customer.address !== "-"
          ? customer.address
          : "Zigatola, Dhanmondi, Dhaka",
      shopName: "Mona POS",
      shopTagline: "Generel store",
      shopHotline: "01851004545",
      shopEmail: "tajul@gmail.com",
      shopAddress: "Zigatola, Dhanmondi, Dhaka, Bangladesh ,Dhaka, dhaka, 1209",
      channel: "pos",
      items: cart.lines.map((l, idx) => ({
        id: l.productId,
        code: l.sku || `111111${idx + 1}`,
        name: l.name,
        uom: "Pcs",
        qty: l.qty,
        tax: 0,
        price: l.price,
        subTotal: l.price * l.qty,
      })),
      subtotal: baseTotal,
      discount: finalDisc,
      shippingCost: 0,
      total: finalTotal,
      paid: {
        cash: pay.cash,
        card: pay.card,
        cardType,
        mfs: pay.mfs,
        mfsType,
        due,
      },
      paidTotal: paidTotal,
      change: changeAmt,
      status: due > 0 ? (paidTotal > 0 ? "Partially Paid" : "Due") : "Received",
      preparedBy: "Chaser",
    };

    if (due > 0 && cart.customerId !== "cus-003")
      dispatch(adjustDue({ customerId: cart.customerId, amount: due }));
    dispatch(createInvoice(payload));
    setLastInvoice({ ...payload, lineCount: cart.lines.length });
    dispatch(clearCart());
    setCusSearch("Walk-in Customer");
    setPay({ cash: 0, card: 0, mfs: 0 });
    setDiscPct(0);
    setDiscTk(0);
  }

  /* ── Close product dropdown on outside click ── */
  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowDrop(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* ── Close customer dropdown on outside click ── */
  useEffect(() => {
    const fn = (e) => {
      if (cusRef.current && !cusRef.current.contains(e.target))
        setCusDropOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* ══════════════════════════════════════ RENDER */
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
      }}
    >
      {/* ━━ TOP BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        style={{
          background: P_COLOR,
          borderBottom: "2px solid " + P_DARK,
          padding: "7px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* ── LEFT: Mona POS Official Logo ── */}
        <Link
          href="/"
          title="Go to Home / Dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
            textDecoration: "none",
            padding: "2px 4px",
            borderRadius: 8,
          }}
        >
          <img
            src="/logo-white.png"
            alt="Mona POS"
            style={{
              height: 38,
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Link>

        {/* ── RIGHT: Customer Search + Add + gap + Exit ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Customer Search */}
          <div
            ref={cusRef}
            style={{ position: "relative", width: 250, flexShrink: 0 }}
          >
            <div style={{ position: "relative" }}>
              <input
                id="pos-customer-search"
                type="text"
                placeholder="কাস্টমার খুঁজুন (নাম / ফোন)…"
                value={cusSearch}
                onChange={(e) => {
                  setCusSearch(e.target.value);
                  setCusDropOpen(true);
                }}
                onFocus={(e) => {
                  setCusDropOpen(true);
                  e.target.select();
                }}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1px solid #c8d8e8",
                  borderRadius: 5,
                  padding: "8px 32px 8px 12px",
                  fontSize: 14,
                  outline: "none",
                  background: "#fff",
                  color: "#1a2e44",
                  cursor: "text",
                  fontWeight: 600,
                }}
              />
              <ChevronDown
                size={16}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#7a93aa",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Dropdown list */}
            {cusDropOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #c8d8e8",
                  borderRadius: 6,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                  zIndex: 9999,
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                {customers
                  .filter((c) => {
                    const q = cusSearch.trim().toLowerCase();
                    if (!q || q === "walk-in customer" || q === "walk customer") return true;
                    return (
                      c.name.toLowerCase().includes(q) ||
                      (c.phone && c.phone.includes(q))
                    );
                  })
                  .map((c) => {
                    const isSelected = c.id === cart.customerId;
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          dispatch(setCustomer(c.id));
                          setCusSearch(c.name);
                          setCusDropOpen(false);
                        }}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          background: isSelected ? "#ebf8dc" : "transparent",
                          borderBottom: "1px solid #f0f5fa",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected)
                            e.currentTarget.style.background = "#f4f9ef";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isSelected
                            ? "#ebf8dc"
                            : "transparent";
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: isSelected ? 700 : 500,
                              fontSize: 13,
                              color: "#1a2e44",
                            }}
                          >
                            {c.name}
                          </div>
                          {c.phone && c.phone !== "N/A" && (
                            <div
                              style={{
                                fontSize: 11,
                                color: "#7a93aa",
                                marginTop: 1,
                              }}
                            >
                              {c.phone}
                            </div>
                          )}
                        </div>
                        {c.due > 0 && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#c0392b",
                              background: "#fdecea",
                              borderRadius: 4,
                              padding: "2px 6px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Due ৳{c.due.toLocaleString()}
                          </span>
                        )}
                      </div>
                    );
                  })}
                {/* No result */}
                {customers.filter((c) => {
                  const q = cusSearch.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    c.name.toLowerCase().includes(q) ||
                    (c.phone && c.phone.includes(q))
                  );
                }).length === 0 && (
                  <div
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#7a93aa",
                      textAlign: "center",
                    }}
                  >
                    কোনো কাস্টমার পাওয়া যায়নি
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add button */}
          <button
            id="pos-add-btn"
            style={{
              background: "#ffffff",
              color: P_DARK,
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            Add +
          </button>

          {/* 40px gap */}
          <div style={{ width: 190 }} />

          {/* Exit */}
          <button
            id="pos-exit"
            onClick={() => (window.location.href = "/")}
            style={{
              background: "#fc2d2dff",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              padding: "9px 20px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7,
              flexShrink: 0,
            }}
          >
            Exit <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* ━━ MAIN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ── LEFT: table area ─────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#fff",
            borderRight: "1px solid #c8d8e8",
          }}
        >
          {/* Search row */}
          <div
            style={{
              borderBottom: "1px solid #c8d8e8",
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#f7fafd",
              flexShrink: 0,
            }}
          >
            <div style={{ position: "relative", flex: 1 }} ref={searchRef}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 9,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#7a93aa",
                }}
              />
              <input
                id="pos-search"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDrop(true);
                }}
                onFocus={() => setShowDrop(true)}
                placeholder="Search product name / barcode / brand…"
                style={{
                  width: "100%",
                  border: "1px solid #c8d8e8",
                  borderRadius: 4,
                  padding: "6px 10px 6px 30px",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#fff",
                  color: "#1a2e44",
                }}
              />

              {/* Dropdown */}
              {showDrop && filtered.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 2px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #c8d8e8",
                    borderRadius: 5,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 200,
                    maxHeight: 280,
                    overflowY: "auto",
                  }}
                >
                  {filtered.map((p) => {
                    const inStock = p.serials.filter(
                      (s) => s.status === "in_stock",
                    ).length;
                    const disabled = inStock === 0 && !showZero;
                    return (
                      <div
                        key={p.id}
                        onClick={() => !disabled && addProduct(p)}
                        style={{
                          padding: "9px 12px",
                          cursor: disabled ? "not-allowed" : "pointer",
                          borderBottom: "1px solid #eef4fa",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          opacity: disabled ? 0.4 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!disabled)
                            e.currentTarget.style.background = "#eef4fa";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              background: "#f1f5f9",
                              border: "1px solid #e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {typeof p.image === "string" && (p.image.startsWith("http") || p.image.startsWith("/")) ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <span style={{ fontSize: 16 }}>{p.image || "📦"}</span>
                            )}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#1a2e44",
                              }}
                            >
                              {p.name}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "#7a93aa",
                                marginTop: 1,
                              }}
                            >
                              {p.variant} · {p.sku}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                            flexShrink: 0,
                            marginLeft: 12,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#0a3050",
                            }}
                          >
                            ৳{p.sellPrice.toLocaleString()}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 500,
                              color: inStock > 0 ? "#0d9e72" : "#d94040",
                            }}
                          >
                            {inStock} in stock
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {showDrop && query.trim() && filtered.length === 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 2px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #c8d8e8",
                    borderRadius: 5,
                    padding: "14px 12px",
                    textAlign: "center",
                    color: "#7a93aa",
                    fontSize: 12,
                    zIndex: 200,
                  }}
                >
                  No product matched "{query}"
                </div>
              )}
            </div>

            {/* 0 Stock */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                color: "#56606e",
                whiteSpace: "nowrap",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={showZero}
                onChange={(e) => setShowZero(e.target.checked)}
                style={{ cursor: "pointer", accentColor: P_COLOR }}
              />
              0 Stock
            </label>

            {/* View Mode Toggle */}
            <div
              style={{
                display: "flex",
                background: P_DIM,
                borderRadius: 5,
                padding: 2,
                gap: 2,
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setViewMode("cards")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  background: viewMode === "cards" ? "#fff" : "transparent",
                  color: viewMode === "cards" ? P_DARK : "#56606e",
                  boxShadow:
                    viewMode === "cards" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}
              >
                <LayoutGrid size={13} /> Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  background: viewMode === "table" ? "#fff" : "transparent",
                  color: viewMode === "table" ? P_DARK : "#56606e",
                  boxShadow:
                    viewMode === "table" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}
              >
                <List size={13} /> List ({cart.lines.length})
              </button>
            </div>
          </div>

          {/* Category Chips Bar (when in Card View) */}
          {viewMode === "cards" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderBottom: "1px solid #e5edf5",
                background: "#fdfefe",
                overflowX: "auto",
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setSelectedCategory("all")}
                style={{
                  border: "none",
                  borderRadius: 14,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: selectedCategory === "all" ? 700 : 500,
                  background:
                    selectedCategory === "all" ? P_COLOR : "#edf2f7",
                  color: selectedCategory === "all" ? "#fff" : "#4a5568",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                All Products ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter(
                  (p) => p.categoryId === cat.id,
                ).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      border: "none",
                      borderRadius: 14,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: isSelected ? 700 : 500,
                      background: isSelected ? P_COLOR : "#edf2f7",
                      color: isSelected ? "#fff" : "#4a5568",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.15s",
                    }}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* ── CARD GRID VIEW ── */}
          {viewMode === "cards" ? (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 12,
                background: "#f4f7fb",
              }}
            >
              {displayProducts.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#7a93aa",
                  }}
                >
                  <Package
                    size={36}
                    style={{ margin: "0 auto 10px", opacity: 0.5 }}
                  />
                  <div
                    style={{ fontSize: 14, fontWeight: 600, color: "#4a607a" }}
                  >
                    No products found
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    Try searching for another product name or check "0 Stock"
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(185px, 1fr))",
                    gap: 12,
                  }}
                >
                  {displayProducts.map((p) => {
                    const inStock = p.serials
                      ? p.serials.filter((s) => s.status === "in_stock").length
                      : p.stock || 0;
                    const disabled = inStock === 0 && !showZero;
                    const cartItem = cart.lines.find(
                      (l) => l.productId === p.id,
                    );
                    const inCartQty = cartItem ? cartItem.qty : 0;

                    return (
                      <div
                        key={p.id}
                        onClick={() => !disabled && addProduct(p)}
                        style={{
                          background: inCartQty > 0 ? "var(--primary-dark, #4e9508)" : P_COLOR,
                          border: "none",
                          borderRadius: 8,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          cursor: disabled ? "not-allowed" : "pointer",
                          opacity: disabled ? 0.55 : 1,
                          boxShadow:
                            inCartQty > 0
                              ? "0 6px 18px rgba(45, 99, 3, 0.45)"
                              : "0 3px 10px rgba(100, 189, 11, 0.28)",
                          transition: "all 0.18s ease",
                          position: "relative",
                          color: "#ffffff",
                        }}
                        onMouseEnter={(e) => {
                          if (!disabled && inCartQty === 0) {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 22px rgba(100, 189, 11, 0.42)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!disabled && inCartQty === 0) {
                            e.currentTarget.style.transform = "none";
                            e.currentTarget.style.boxShadow =
                              "0 3px 10px rgba(100, 189, 11, 0.28)";
                          }
                        }}
                      >
                        {/* Top: Image Full Width & Height */}
                        <div
                          style={{
                            width: "100%",
                            height: 135,
                            background: "rgba(0,0,0,0.08)",
                            position: "relative",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {typeof p.image === "string" && (p.image.startsWith("http") || p.image.startsWith("/")) ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                if (e.currentTarget.nextSibling) {
                                  e.currentTarget.nextSibling.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display:
                                typeof p.image === "string" &&
                                (p.image.startsWith("http") || p.image.startsWith("/"))
                                  ? "none"
                                  : "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 38,
                            }}
                          >
                            {p.image || "📦"}
                          </div>
                        </div>

                        {/* Bottom: Category, Stock, Name, Detail, Price & Add Button */}
                        <div
                          style={{
                            padding: 10,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            flex: 1,
                          }}
                        >
                          {/* Category + Stock */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 6,
                              gap: 4,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 800,
                                background: "rgba(255, 255, 255, 0.95)",
                                color: "var(--primary-dark, #3b7405)",
                                borderRadius: 4,
                                padding: "2px 7px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 95,
                              }}
                            >
                              {p.brand || "General"}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                color: inStock > 0 ? "var(--primary-dark, #3b7405)" : "#b91c1c",
                                background: inStock > 0 ? "rgba(255, 255, 255, 0.95)" : "#fee2e2",
                                borderRadius: 4,
                                padding: "2px 7px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {inStock > 0 ? `${inStock} in stock` : "0 stock"}
                            </span>
                          </div>

                          {/* Name + Detail */}
                          <div style={{ marginBottom: 6 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 750,
                                color: "#ffffff",
                                lineHeight: 1.3,
                                minHeight: 34,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                              }}
                              title={p.name}
                            >
                              {p.name}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "rgba(255, 255, 255, 0.9)",
                                marginTop: 2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {p.variant || p.sku}
                            </div>
                          </div>

                          {/* Price + Action */}
                          <div
                            style={{
                              borderTop: "1px solid rgba(255, 255, 255, 0.3)",
                              paddingTop: 8,
                              marginTop: "auto",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 4,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: 9,
                                  color: "rgba(255, 255, 255, 0.85)",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  fontWeight: 700,
                                }}
                              >
                                Price
                              </div>
                              <div
                                style={{
                                  fontSize: 15,
                                  fontWeight: 900,
                                  color: "#ffffff",
                                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                                }}
                              >
                                ৳{p.sellPrice.toLocaleString()}
                              </div>
                            </div>

                            {/* Add / Qty Control */}
                            {inCartQty > 0 ? (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  background: "#ffffff",
                                  borderRadius: 6,
                                  padding: "2px 5px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                                }}
                              >
                                <button
                                  onClick={() => handleCardDecrement(p.id)}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--primary-dark, #3b7405)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "2px 4px",
                                    fontWeight: 900,
                                  }}
                                >
                                  <Minus size={13} strokeWidth={3} />
                                </button>
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 900,
                                    color: "var(--primary-dark, #3b7405)",
                                    padding: "0 4px",
                                    minWidth: 16,
                                    textAlign: "center",
                                  }}
                                >
                                  {inCartQty}
                                </span>
                                <button
                                  onClick={() => addProduct(p)}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--primary-dark, #3b7405)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "2px 4px",
                                    fontWeight: 900,
                                  }}
                                >
                                  <Plus size={13} strokeWidth={3} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!disabled) addProduct(p);
                                }}
                                disabled={disabled}
                                style={{
                                  background: disabled ? "rgba(255,255,255,0.4)" : "#ffffff",
                                  color: disabled ? "rgba(255,255,255,0.85)" : "var(--primary-dark, #3b7405)",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "5px 12px",
                                  fontSize: 12,
                                  fontWeight: 800,
                                  cursor: disabled ? "not-allowed" : "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  boxShadow: disabled ? "none" : "0 2px 6px rgba(0,0,0,0.18)",
                                }}
                              >
                                <Plus size={13} strokeWidth={3} /> Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ── DETAILED TABLE VIEW ── */
            <div style={{ flex: 1, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, width: 32 }}>#</th>
                    <th style={{ ...TH, textAlign: "left", minWidth: 180 }}>
                      Product
                    </th>
                    <th style={TH}>Group</th>
                    <th style={TH}>Stock</th>
                    <th style={TH}>Box?</th>
                    <th style={{ ...TH, width: 68 }}>No of Box</th>
                    <th style={TH}>Price</th>
                    <th style={{ ...TH, minWidth: 118 }}>Quantity</th>
                    <th style={{ ...TH, width: 86 }}>Discount</th>
                    <th style={TH}>Sub-Total</th>
                    <th style={{ ...TH, borderRight: "none", width: 30 }} />
                  </tr>
                </thead>
                <tbody>
                  {lineCalcs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={12}
                        style={{
                          textAlign: "center",
                          padding: "48px 20px",
                          color: "#6b7c93",
                          fontSize: 13,
                        }}
                      >
                        <ShoppingCart
                          size={36}
                          style={{ margin: "0 auto 10px", color: P_COLOR, opacity: 0.8 }}
                        />
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a2e44", marginBottom: 4 }}>
                          তালিকা মোড (List View) — বিক্রয় রশিদ ফাঁকা
                        </div>
                        <div style={{ fontSize: 12, color: "#7a93aa", maxWidth: 440, margin: "0 auto 14px" }}>
                          ওপরের সার্চ বক্সে পণ্যের নাম/বারকোড লিখুন অথবা সরাসরি বারকোড স্ক্যানার দিয়ে প্রোডাক্ট যুক্ত করুন।
                        </div>
                        <button
                          onClick={() => setViewMode("cards")}
                          style={{
                            background: P_COLOR,
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "7px 16px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: "0 2px 8px rgba(100,189,11,0.25)",
                          }}
                        >
                          <LayoutGrid size={14} /> Browse Photo Cards
                        </button>
                      </td>
                    </tr>
                  ) : (
                    lineCalcs.map((l, idx) => (
                      <tr
                        key={l.key}
                        style={{
                          borderBottom: "1px solid #eaf0f8",
                          background: idx % 2 === 0 ? "#fff" : "#f7fafd",
                        }}
                      >
                        {/* # */}
                        <td
                          style={{ ...TD, color: "#7a93aa", fontWeight: 600 }}
                        >
                          {idx + 1}
                        </td>

                        {/* Product */}
                        <td
                          style={{
                            ...TD,
                            textAlign: "left",
                            fontWeight: 600,
                            color: "#0a3050",
                          }}
                        >
                          {l.name}
                        </td>

                        {/* Group */}
                        <td style={{ ...TD, color: "#56606e" }}>{l.group}</td>

                        {/* Stock */}
                        <td style={TD}>
                          <span
                            style={{
                              fontWeight: 600,
                              color: l.stock > 0 ? "#0d9e72" : "#d94040",
                            }}
                          >
                            {l.stock}
                          </span>
                        </td>

                        {/* Box? */}
                        <td style={TD}>
                          <input
                            type="checkbox"
                            checked={(l.noOfBox || 0) > 0}
                            onChange={(e) =>
                              dispatch(
                                updateLine({
                                  key: l.key,
                                  field: "noOfBox",
                                  value: e.target.checked ? 1 : 0,
                                }),
                              )
                            }
                            style={{
                              cursor: "pointer",
                              accentColor: P_COLOR,
                            }}
                          />
                        </td>

                        {/* No of Box */}
                        <td style={TD}>
                          <input
                            type="number"
                            min={0}
                            value={l.noOfBox || 0}
                            onChange={(e) =>
                              dispatch(
                                updateLine({
                                  key: l.key,
                                  field: "noOfBox",
                                  value: Number(e.target.value),
                                }),
                              )
                            }
                            style={CELL_IN}
                          />
                        </td>

                        {/* Price */}
                        <td style={TD}>
                          <span style={{ fontWeight: 700 }}>
                            {l.price.toLocaleString()}
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: "#7a93aa",
                              marginLeft: 2,
                            }}
                          >
                            TK
                          </span>
                        </td>

                        {/* Quantity */}
                        <td style={TD}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              border: "1px solid #b8cce0",
                              borderRadius: 3,
                              overflow: "hidden",
                            }}
                          >
                            <button
                              onClick={() => {
                                if (l.qty > 1) {
                                  dispatch(
                                    setQty({ key: l.key, qty: l.qty - 1 }),
                                  );
                                } else {
                                  dispatch(removeLine(l.key));
                                }
                              }}
                              style={QTY_BTN}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={l.qty}
                              onChange={(e) => {
                                const val = Math.max(
                                  1,
                                  Number(e.target.value) || 1,
                                );
                                dispatch(setQty({ key: l.key, qty: val }));
                              }}
                              style={{
                                ...CELL_IN,
                                border: "none",
                                borderRadius: 0,
                                width: 38,
                              }}
                            />
                            <button
                              onClick={() =>
                                dispatch(setQty({ key: l.key, qty: l.qty + 1 }))
                              }
                              style={QTY_BTN}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Discount */}
                        <td style={TD}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={l.discountPct || 0}
                              onChange={(e) =>
                                dispatch(
                                  updateLine({
                                    key: l.key,
                                    field: "discountPct",
                                    value: Number(e.target.value),
                                  }),
                                )
                              }
                              style={{ ...CELL_IN, width: 44 }}
                            />
                            <span style={{ fontSize: 11, color: "#7a93aa" }}>
                              %
                            </span>
                          </div>
                        </td>

                        {/* Sub-Total */}
                        <td
                          style={{ ...TD, fontWeight: 700, color: "#0a3050" }}
                        >
                          {l.subTotal.toFixed(2)}
                        </td>

                        {/* Remove */}
                        <td style={{ ...TD, borderRight: "none" }}>
                          <button
                            onClick={() => dispatch(removeLine(l.key))}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#c0303a",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 4,
                              borderRadius: 3,
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#fdecea")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "none")
                            }
                          >
                            <X size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ━━ BOTTOM ACTION BAR ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div
            style={{
              background: "transparent",
              width: "fit-content",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <button id="pos-return" style={{ ...ACT_BTN, background: "#7b5c22" }}>
              Return <RotateCcw size={13} />
            </button>
            <button id="pos-hold" style={{ ...ACT_BTN, background: "#c97520" }}>
              Hold <Package size={13} />
            </button>
            <button
              id="pos-refresh"
              onClick={() => {
                dispatch(clearCart());
                dispatch(resetToDemo());
                setPay({ cash: 0, card: 0, mfs: 0 });
                setDiscPct(0);
                setDiscTk(0);
                setQuery("");
                setCusSearch("Walk-in Customer");
              }}
              style={{ ...ACT_BTN, background: P_COLOR }}
            >
              Refresh <RefreshCw size={13} />
            </button>
            <button
              id="pos-last-bill"
              onClick={() => lastInvoice && setLastInvoice({ ...lastInvoice })}
              style={{ ...ACT_BTN, background: P_HOVER }}
            >
              Last Bill <Receipt size={13} />
            </button>
          </div>
        </div>

        {/* ── RIGHT: Cart Items + Finalize Sale ─────────────────── */}
        <div
          style={{
            width: 340,
            flexShrink: 0,
            height: "fit-content",
            maxHeight: "100%",
            alignSelf: "flex-start",
            background: P_COLOR,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            borderLeft: "1px solid " + P_DARK,
            borderBottom: "1px solid " + P_DARK,
            color: "#ffffff",
          }}
        >
          {/* Cart Items Header */}
          <div
            style={{
              padding: "10px 14px 8px",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.12)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <ShoppingCart size={15} color="#ffffff" />
              <span>Cart Items ({lineCalcs.length})</span>
            </div>
            {lineCalcs.length > 0 && (
              <button
                onClick={() => dispatch(clearCart())}
                style={{
                  border: "none",
                  background: "rgba(255,255,255,0.2)",
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "3px 8px",
                  borderRadius: 4,
                }}
                title="Clear all cart items"
              >
                <Trash2 size={12} /> Clear
              </button>
            )}
          </div>

          {/* ── Cart Items List ── */}
          <div
            style={{
              height: 280,
              overflowY: "auto",
              padding: "6px 10px",
              background: "rgba(0,0,0,0.06)",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {lineCalcs.length === 0 ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "16px 10px",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <Package
                  size={28}
                  style={{ margin: "0 auto 6px", opacity: 0.9, color: "#ffffff" }}
                />
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
                  No items in cart
                </div>
                <div style={{ fontSize: 11, marginTop: 2, color: "rgba(255,255,255,0.8)" }}>
                  Click on any product card to add
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {lineCalcs.map((l) => (
                  <div
                    key={l.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 8px",
                      background: "#fff",
                      border: "1px solid #e2edf8",
                      borderRadius: 6,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                  >
                    {/* Item Image */}
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 6,
                        background: "#fff",
                        border: "1px solid #d9e2ec",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        flexShrink: 0,
                        overflow: "hidden",
                        padding: 2,
                      }}
                    >
                      {typeof l.image === "string" && (l.image.startsWith("http") || l.image.startsWith("/")) ? (
                        <img
                          src={l.image}
                          alt={l.name}
                          style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span>{l.image || "📦"}</span>
                      )}
                    </div>

                    {/* Title + Unit Price */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#0a3050",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={l.name}
                      >
                        {l.name}
                      </div>
                      <div
                        style={{ fontSize: 10, color: "#7a93aa", marginTop: 1 }}
                      >
                        ৳{l.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        background: "#eef4fa",
                        borderRadius: 4,
                        padding: 2,
                        flexShrink: 0,
                      }}
                    >
                      <button
                        onClick={() => {
                          if (l.qty > 1) {
                            dispatch(setQty({ key: l.key, qty: l.qty - 1 }));
                          } else {
                            dispatch(removeLine(l.key));
                          }
                        }}
                        style={{
                          border: "none",
                          background: "#fff",
                          color: "#4E9409",
                          width: 20,
                          height: 20,
                          borderRadius: 3,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                        }}
                      >
                        <Minus size={11} />
                      </button>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#0a3050",
                          minWidth: 16,
                          textAlign: "center",
                        }}
                      >
                        {l.qty}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(setQty({ key: l.key, qty: l.qty + 1 }))
                        }
                        style={{
                          border: "none",
                          background: "#64BD0B",
                          color: "#fff",
                          width: 20,
                          height: 20,
                          borderRadius: 3,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#4E9409",
                        minWidth: 52,
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      ৳{(l.price * l.qty).toLocaleString()}
                    </div>

                    {/* Delete Cross */}
                    <button
                      onClick={() => dispatch(removeLine(l.key))}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#c0392b",
                        cursor: "pointer",
                        padding: 3,
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                      title="Remove item"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fdecea")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Summary & Payment (Compact) ── */}
          <div
            style={{
              padding: "10px 14px 12px",
              background: "rgba(0,0,0,0.12)",
              borderTop: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {/* Header / Qty count */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,0.15)",
                borderRadius: 5,
                padding: "6px 10px",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 11, color: "#ffffff", fontWeight: 600 }}>
                Total Qty: <strong style={{ color: "#ffffff" }}>{totalQty}</strong>
              </span>
              <span style={{ fontSize: 11, color: "#ffffff", fontWeight: 600 }}>
                Total Items: <strong style={{ color: "#ffffff" }}>{totalItems}</strong>
              </span>
            </div>

            {/* Summary rows */}
            {[{ label: "Gross Total:", val: `৳${grossTotal.toFixed(2)}` }].map(
              (r) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 5,
                    color: "rgba(255,255,255,0.95)",
                  }}
                >
                  <span>{r.label}</span>
                  <span style={{ fontWeight: 700, color: "#ffffff" }}>
                    {r.val}
                  </span>
                </div>
              ),
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(255,255,255,0.25)",
                borderBottom: "1px solid rgba(255,255,255,0.25)",
                padding: "6px 0",
                marginBottom: 8,
                fontSize: 12,
              }}
            >
              <span style={{ color: "#ffffff", fontWeight: 700 }}>
                Round Total:
              </span>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#ffffff",
                }}
              >
                ৳{grossRound.toFixed(2)}
              </span>
            </div>

            {/* Payment fields (Compact with Selects) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {/* Cash */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: "#ffffff", fontWeight: 600 }}>Cash:</span>
                <input
                  id="pos-cash"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={pay.cash || ""}
                  onChange={(e) =>
                    setPay({ ...pay, cash: Number(e.target.value) || 0 })
                  }
                  style={{
                    border: "1px solid rgba(0,0,0,0.15)",
                    borderRadius: 4,
                    padding: "4px 8px",
                    fontSize: 12,
                    width: 84,
                    outline: "none",
                    textAlign: "right",
                    background: "#ffffff",
                    color: "#0a0e16",
                    fontWeight: 700,
                  }}
                />
              </div>

              {/* Card with Select */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 12, color: "#ffffff", fontWeight: 600, flexShrink: 0 }}>
                  Card:
                </span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    style={{
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderRadius: 4,
                      padding: "4px 6px",
                      fontSize: 11,
                      outline: "none",
                      background: "#ffffff",
                      color: "#0a0e16",
                      fontWeight: 600,
                    }}
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">Amex</option>
                    <option value="NexusPay">NexusPay</option>
                  </select>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={pay.card || ""}
                    onChange={(e) =>
                      setPay({ ...pay, card: Number(e.target.value) || 0 })
                    }
                    style={{
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderRadius: 4,
                      padding: "4px 6px",
                      fontSize: 12,
                      width: 68,
                      outline: "none",
                      textAlign: "right",
                      background: "#ffffff",
                      color: "#0a0e16",
                      fontWeight: 700,
                    }}
                  />
                </div>
              </div>

              {/* MFS with Select */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 12, color: "#ffffff", fontWeight: 600, flexShrink: 0 }}>
                  MFS:
                </span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <select
                    value={mfsType}
                    onChange={(e) => setMfsType(e.target.value)}
                    style={{
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderRadius: 4,
                      padding: "4px 6px",
                      fontSize: 11,
                      outline: "none",
                      background: "#ffffff",
                      color: "#0a0e16",
                      fontWeight: 600,
                    }}
                  >
                    <option value="Bkash">Bkash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Upay">Upay</option>
                  </select>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={pay.mfs || ""}
                    onChange={(e) =>
                      setPay({ ...pay, mfs: Number(e.target.value) || 0 })
                    }
                    style={{
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderRadius: 4,
                      padding: "4px 6px",
                      fontSize: 12,
                      width: 68,
                      outline: "none",
                      textAlign: "right",
                      background: "#ffffff",
                      color: "#0a0e16",
                      fontWeight: 700,
                    }}
                  />
                </div>
              </div>

              {/* Discount */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: "#ffffff", fontWeight: 600 }}>
                  Discount (৳):
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={discTk || ""}
                  onChange={(e) => setDiscTk(Number(e.target.value) || 0)}
                  style={{
                    border: "1px solid rgba(0,0,0,0.15)",
                    borderRadius: 4,
                    padding: "4px 8px",
                    fontSize: 12,
                    width: 84,
                    outline: "none",
                    textAlign: "right",
                    background: "#ffffff",
                    color: "#0a0e16",
                    fontWeight: 700,
                  }}
                />
              </div>

              {/* Change Amount */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 12,
                  borderTop: "1px solid rgba(255,255,255,0.25)",
                  paddingTop: 6,
                  marginTop: 2,
                }}
              >
                <span style={{ color: "#ffffff", fontWeight: 700 }}>
                  Change:
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 14,
                    color: "#ffffff",
                    background: "rgba(0,0,0,0.2)",
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  {changeAmt >= 0 ? "+" : ""}৳{changeAmt.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Print Bill — right under Change Amount */}
            <div style={{ marginTop: 10 }}>
              <button
                id="pos-print-bill"
                onClick={handleCheckout}
                disabled={!cart.lines.length}
                style={{
                  width: "100%",
                  background: cart.lines.length ? "#ffffff" : "rgba(255,255,255,0.3)",
                  color: cart.lines.length ? P_DARK : "rgba(255,255,255,0.6)",
                  border: "none",
                  borderRadius: 6,
                  padding: "7px 18px",
                  fontSize: 18,
                  fontWeight: 800,
                  cursor: cart.lines.length ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: cart.lines.length
                    ? "0 4px 14px rgba(0,0,0,0.2)"
                    : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Printer size={18} /> Print Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ━━ ORDER COMPLETE / THERMAL RECEIPT MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {lastInvoice && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,18,30,0.65)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            zIndex: 9999,
            padding: "20px 12px 30px",
            overflowY: "auto",
            backdropFilter: "blur(4px)",
          }}
        >
          {/* Floating Action Buttons */}
          <div
            className="no-print"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
              flexShrink: 0,
            }}
          >
            <button
              id="pos-print-receipt-btn"
              onClick={() => window.print()}
              style={{
                background: P_COLOR,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 22px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
                boxShadow: "0 4px 12px var(--primary-shadow, rgba(100,189,11,0.35))",
              }}
            >
              <Printer size={16} /> Print Bill
            </button>
            <button
              onClick={() => setLastInvoice(null)}
              style={{
                background: "#fff",
                color: "#334155",
                border: "1px solid #cbd5e1",
                borderRadius: 6,
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              <X size={16} /> Cancle
            </button>
          </div>

          {/* Printable Thermal Receipt Slip */}
          <div
            id="printable-pos-invoice"
            style={{
              background: "#fff",
              width: 390,
              maxWidth: "100%",
              borderRadius: 6,
              padding: "24px 22px 28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              color: "#1e293b",
              fontFamily:
                "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
              fontSize: 12,
              lineHeight: 1.35,
            }}
          >
            {/* Header: Brand Name + Tagline */}
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#d94828",
                  letterSpacing: -0.5,
                  marginBottom: 2,
                }}
              >
                {lastInvoice.shopName || "Mona POS"}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                {lastInvoice.shopTagline || "Generel store"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#334155",
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                Invoice No: {lastInvoice.invoiceNo}
              </div>
            </div>

            {/* Metadata Rows */}
            <div
              style={{
                fontSize: 11.5,
                color: "#334155",
                marginBottom: 10,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Phone: {lastInvoice.shopHotline || "01851004545"}</span>
                <span>Date: {lastInvoice.date}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Customer: {lastInvoice.customerName}</span>
                <span>
                  Phone:{" "}
                  {lastInvoice.customerPhone &&
                  lastInvoice.customerPhone !== "N/A"
                    ? lastInvoice.customerPhone
                    : ""}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Biller: {lastInvoice.preparedBy || "fazlul haque"}</span>
              </div>
            </div>

            {/* ORDER DETAILS Section Title */}
            <div
              style={{
                textAlign: "center",
                fontWeight: 800,
                fontSize: 12.5,
                color: "#0f172a",
                letterSpacing: 0.5,
                padding: "4px 0",
                borderTop: "1px dashed #cbd5e1",
                borderBottom: "1px dashed #cbd5e1",
                margin: "8px 0 6px",
              }}
            >
              ORDER DETAILS
            </div>

            {/* Items Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11.5,
                marginBottom: 8,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    color: "#64748b",
                  }}
                >
                  <th
                    style={{
                      padding: "4px 0",
                      textAlign: "left",
                      fontWeight: 600,
                    }}
                  >
                    Item
                  </th>
                  <th
                    style={{
                      padding: "4px 0",
                      textAlign: "center",
                      width: 32,
                      fontWeight: 600,
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      padding: "4px 0",
                      textAlign: "right",
                      width: 50,
                      fontWeight: 600,
                    }}
                  >
                    Rate
                  </th>
                  <th
                    style={{
                      padding: "4px 0",
                      textAlign: "right",
                      width: 62,
                      fontWeight: 600,
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {lastInvoice.items &&
                  lastInvoice.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td
                        style={{
                          padding: "5px 0",
                          fontWeight: 600,
                          color: "#1e293b",
                        }}
                      >
                        {item.name}
                      </td>
                      <td
                        style={{
                          padding: "5px 0",
                          textAlign: "center",
                          color: "#334155",
                        }}
                      >
                        {item.qty}
                      </td>
                      <td
                        style={{
                          padding: "5px 0",
                          textAlign: "right",
                          color: "#334155",
                        }}
                      >
                        {item.price.toFixed(0)}
                      </td>
                      <td
                        style={{
                          padding: "5px 0",
                          textAlign: "right",
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {(item.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Detailed Financial Breakdown */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                fontSize: 12,
                borderTop: "1px solid #e2e8f0",
                paddingTop: 6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#475569" }}>Total Item:</span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>
                  {lastInvoice.items?.reduce((s, i) => s + i.qty, 0) ||
                    lastInvoice.lineCount}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#475569" }}>Total:</span>
                <span style={{ fontWeight: 600 }}>
                  {lastInvoice.subtotal
                    ? lastInvoice.subtotal.toFixed(2)
                    : "0.00"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#475569" }}>Discount:</span>
                <span>
                  {lastInvoice.discount ? lastInvoice.discount.toFixed(0) : "0"}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", paddingLeft: 4 }}>
                None
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#475569" }}>Gross Total:</span>
                <span style={{ fontWeight: 600 }}>
                  {lastInvoice.total ? lastInvoice.total.toFixed(2) : "0.00"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#475569" }}>
                  Gross Total (Rounding):
                </span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>
                  {lastInvoice.total ? lastInvoice.total.toFixed(2) : "0.00"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #f1f5f9",
                  paddingTop: 3,
                }}
              >
                <span style={{ color: "#475569" }}>Received Cash:</span>
                <span style={{ fontWeight: 600 }}>
                  {lastInvoice.paidTotal
                    ? lastInvoice.paidTotal.toFixed(0)
                    : lastInvoice.total.toFixed(0)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#475569" }}>Total Received:</span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>
                  {lastInvoice.paidTotal
                    ? lastInvoice.paidTotal.toFixed(0)
                    : lastInvoice.total.toFixed(0)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#475569" }}>Change Amount:</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: lastInvoice.change >= 0 ? "#0d9e72" : "#c0392b",
                  }}
                >
                  {lastInvoice.change !== undefined
                    ? Math.max(0, lastInvoice.change).toFixed(2)
                    : "0.00"}
                </span>
              </div>
            </div>

            {/* Points & N.B. Disclaimer */}
            <div
              style={{
                textAlign: "center",
                margin: "14px 0 10px",
                fontSize: 11,
                color: "#475569",
              }}
            >
              <div style={{ fontStyle: "italic", marginBottom: 3 }}>
                Previous Point: 0 | New Point :
                {Math.floor((lastInvoice.total || 0) / 100)}
              </div>
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: 10.5,
                  color: "#64748b",
                }}
              >
                N.B: Sold products will not be returned after 24 hours
              </div>
            </div>

            {/* Barcode */}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <BarcodeSVG value={lastInvoice.invoiceNo} />
            </div>

            {/* Hotline & Thank You Footer */}
            <div
              style={{
                textAlign: "center",
                marginTop: 12,
                borderTop: "1px dashed #cbd5e1",
                paddingTop: 8,
              }}
            >
              <div
                style={{ fontSize: 12.5, fontWeight: 800, color: "#0f172a" }}
              >
                Hot Line: {lastInvoice.shopHotline || "01851004545"}
              </div>
              <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 2 }}>
                Thank you for shopping with us
              </div>
            </div>
          </div>

          {/* CSS for print mode */}
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-pos-invoice,
              #printable-pos-invoice * {
                visibility: visible;
              }
              #printable-pos-invoice {
                position: absolute;
                left: 50% !important;
                top: 0 !important;
                transform: translateX(-50%) !important;
                width: 380px !important;
                padding: 12px !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
