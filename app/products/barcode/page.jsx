"use client";

import { useState } from "react";
import {
  Barcode,
  Printer,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Sliders,
  Eye,
  QrCode,
  Tag,
  Settings2,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const SAMPLE_PRODUCTS = [
  { id: 1, name: "Sony Bravia 55' 4K OLED TV", sku: "SNY-55-OLED", barcode: "8901234567891", price: 115000, batch: "B-2026-09", qty: 2 },
  { id: 2, name: "Whirlpool Inverter AC 1.5 Ton", sku: "WHL-AC-15T", barcode: "8901234567892", price: 68500, batch: "B-2026-10", qty: 4 },
  { id: 3, name: "Philips Air Fryer XL 6.2L", sku: "PHP-AF-62L", barcode: "8901234567893", price: 16500, batch: "B-2026-08", qty: 8 },
];

export default function BarcodePage() {
  const [selectedItems, setSelectedItems] = useState(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState("");
  const [labelSize, setLabelSize] = useState("50x25"); // '50x25' | '38x25' | '100x50'
  const [barcodeFormat, setBarcodeFormat] = useState("CODE128");
  const [options, setOptions] = useState({
    showBusinessName: true,
    showProductName: true,
    showPrice: true,
    showSKU: true,
    showBatch: true,
  });

  const totalLabels = selectedItems.reduce((acc, item) => acc + (Number(item.qty) || 1), 0);

  const handleQtyChange = (id, val) => {
    const qty = Math.max(1, parseInt(val) || 1);
    setSelectedItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const handleRemove = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* ━━ Header & Print Trigger ━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#64BD0B]/10 text-[#3B7506]">
              <Barcode size={22} className="text-[#3B7506]" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Barcode &amp; Price Label Generator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Design and batch print standard thermal barcode stickers, shelf edge labels, and jewelry price tags.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
        >
          <Printer size={16} />
          <span>Print {totalLabels} Label(s)</span>
        </button>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Queued Labels"
          value={`${totalLabels} Stickers`}
          trend={{ value: `${selectedItems.length} products selected`, positive: true }}
          icon={Tag}
          accent="emerald"
        />
        <StatCard
          label="Label Format"
          value={labelSize === "50x25" ? "50 × 25 mm" : labelSize === "38x25" ? "38 × 25 mm" : "100 × 50 mm"}
          trend={{ value: "Thermal Roll 1-Column", positive: true }}
          icon={Barcode}
          accent="blue"
        />
        <StatCard
          label="Barcode Symbology"
          value={barcodeFormat}
          trend={{ value: "High-density 1D code", positive: true }}
          icon={QrCode}
          accent="amber"
        />
        <StatCard
          label="Print Resolution"
          value="203 DPI"
          trend={{ value: "Optimized for TSC / Xprinter", positive: true }}
          icon={Printer}
          accent="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ━━ Left Column: Products Queue & Settings (7 cols) ━━ */}
        <div className="lg:col-span-7 space-y-5">
          {/* Label Configuration Settings */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Settings2 size={16} className="text-[#3B7506]" />
              <span>Label Dimensions &amp; Elements</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sticker Paper Size:
                </label>
                <select
                  value={labelSize}
                  onChange={(e) => setLabelSize(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:border-[#64BD0B] outline-none"
                >
                  <option value="50x25">50mm × 25mm (Standard Retail)</option>
                  <option value="38x25">38mm × 25mm (Compact / Jewelry)</option>
                  <option value="100x50">100mm × 50mm (Carton / Logistics)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Symbology Type:
                </label>
                <select
                  value={barcodeFormat}
                  onChange={(e) => setBarcodeFormat(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:border-[#64BD0B] outline-none"
                >
                  <option value="CODE128">Code 128 (Alphanumeric)</option>
                  <option value="EAN13">EAN-13 (Standard Retail)</option>
                  <option value="QR">QR Code (2D DataMatrix)</option>
                </select>
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.showBusinessName}
                  onChange={() => toggleOption("showBusinessName")}
                  className="accent-[#64BD0B]"
                />
                <span>Store Name</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.showProductName}
                  onChange={() => toggleOption("showProductName")}
                  className="accent-[#64BD0B]"
                />
                <span>Product Name</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.showPrice}
                  onChange={() => toggleOption("showPrice")}
                  className="accent-[#64BD0B]"
                />
                <span>MRP / Price</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.showSKU}
                  onChange={() => toggleOption("showSKU")}
                  className="accent-[#64BD0B]"
                />
                <span>SKU Code</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.showBatch}
                  onChange={() => toggleOption("showBatch")}
                  className="accent-[#64BD0B]"
                />
                <span>Batch No</span>
              </label>
            </div>
          </div>

          {/* Selected Products Queue */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">
                Print Queue ({selectedItems.length} Products)
              </h2>
              <span className="text-xs text-slate-400">Total {totalLabels} stickers to print</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3">Item Details</th>
                    <th className="py-2.5 px-3">Barcode</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-center w-24">Sticker Qty</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{item.sku} • {item.batch}</p>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#3B7506]">
                        {item.barcode}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                        ৳{item.price.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          className="w-16 py-1 text-center font-bold border border-slate-200 rounded-lg focus:border-[#64BD0B] outline-none"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ━━ Right Column: Live Label Preview (5 cols) ━━ */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Eye size={16} className="text-[#3B7506]" />
                <span>Thermal Label Live Preview</span>
              </h2>
              <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                {labelSize} mm
              </span>
            </div>

            {/* Label Canvas Simulation */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-100/70 border border-dashed border-slate-300 rounded-2xl">
              {selectedItems.length > 0 ? (
                <div
                  className="bg-white border-2 border-slate-800 rounded-lg p-3 text-slate-900 shadow-md flex flex-col items-center justify-between transition-all"
                  style={{
                    width: labelSize === "38x25" ? "210px" : labelSize === "100x50" ? "320px" : "250px",
                    minHeight: labelSize === "38x25" ? "130px" : labelSize === "100x50" ? "200px" : "155px",
                  }}
                >
                  {options.showBusinessName && (
                    <p className="text-[10px] font-black uppercase tracking-wider text-center border-b border-slate-300 pb-0.5 w-full">
                      Mona POS Flagship Store
                    </p>
                  )}

                  {options.showProductName && (
                    <p className="text-[11px] font-extrabold text-center line-clamp-2 mt-1">
                      {selectedItems[0].name}
                    </p>
                  )}

                  {/* Barcode Visual Lines */}
                  <div className="my-1.5 flex flex-col items-center w-full">
                    {barcodeFormat === "QR" ? (
                      <div className="w-16 h-16 bg-slate-900 p-1 rounded flex items-center justify-center text-white">
                        <QrCode size={48} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-[2px] h-9 w-4/5 py-1">
                        <span className="w-1 h-full bg-black"></span>
                        <span className="w-0.5 h-full bg-black"></span>
                        <span className="w-1.5 h-full bg-black"></span>
                        <span className="w-0.5 h-full bg-black"></span>
                        <span className="w-2 h-full bg-black"></span>
                        <span className="w-1 h-full bg-black"></span>
                        <span className="w-0.5 h-full bg-black"></span>
                        <span className="w-1.5 h-full bg-black"></span>
                        <span className="w-0.5 h-full bg-black"></span>
                        <span className="w-1 h-full bg-black"></span>
                        <span className="w-2 h-full bg-black"></span>
                        <span className="w-0.5 h-full bg-black"></span>
                        <span className="w-1 h-full bg-black"></span>
                        <span className="w-1.5 h-full bg-black"></span>
                        <span className="w-0.5 h-full bg-black"></span>
                        <span className="w-1 h-full bg-black"></span>
                        <span className="w-2 h-full bg-black"></span>
                      </div>
                    )}
                    <p className="font-mono text-[10px] font-bold tracking-widest mt-0.5">
                      {selectedItems[0].barcode}
                    </p>
                  </div>

                  {/* Footer Info: SKU, Batch, Price */}
                  <div className="w-full flex items-center justify-between text-[10px] font-bold pt-1 border-t border-slate-200">
                    <div>
                      {options.showSKU && <p className="font-mono">{selectedItems[0].sku}</p>}
                      {options.showBatch && <p className="text-[9px] text-slate-500 font-normal">Bat: {selectedItems[0].batch}</p>}
                    </div>
                    {options.showPrice && (
                      <p className="text-xs font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                        ৳{selectedItems[0].price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Queue is empty. Select products to preview.</p>
              )}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#64BD0B]/10 border border-[#64BD0B]/20 text-[11px] text-[#3B7506] flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>Direct Thermal 1:1 Print Ready via USB or Network IP.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
