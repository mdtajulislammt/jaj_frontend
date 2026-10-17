"use client";

import { useState } from "react";
import {
  Boxes,
  Plus,
  Scale,
  Palette,
  HardDrive,
  Layers,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  Tag,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INITIAL_UNITS = [
  { id: 1, name: "Piece (Pcs)", shortName: "pcs", baseUnit: "Self", operator: "*", value: 1, productsCount: 340 },
  { id: 2, name: "Carton / Box", shortName: "ctn", baseUnit: "Piece (Pcs)", operator: "*", value: 24, productsCount: 65 },
  { id: 3, name: "Kilogram", shortName: "kg", baseUnit: "Self", operator: "*", value: 1, productsCount: 88 },
  { id: 4, name: "Gram", shortName: "g", baseUnit: "Kilogram", operator: "/", value: 1000, productsCount: 42 },
  { id: 5, name: "Liter", shortName: "ltr", baseUnit: "Self", operator: "*", value: 1, productsCount: 29 },
];

const INITIAL_ATTRIBUTES = [
  { id: 1, name: "Storage Capacity", values: ["64GB", "128GB", "256GB", "512GB", "1TB"], category: "Electronics" },
  { id: 2, name: "Color Finish", values: ["Midnight Black", "Titanium Gray", "Ocean Blue", "Pure White", "Gold"], category: "All" },
  { id: 3, name: "Size / Dimensions", values: ["XS", "S", "M", "L", "XL", "XXL"], category: "Apparel & Accessories" },
  { id: 4, name: "AC Capacity / Tonnage", values: ["1.0 Ton", "1.5 Ton", "2.0 Ton", "2.5 Ton"], category: "Appliances" },
  { id: 5, name: "Net Weight", values: ["250g", "500g", "1kg", "5kg", "25kg"], category: "FMCG / Food" },
];

export default function VariantsPage() {
  const [activeTab, setActiveTab] = useState("variants"); // 'variants' | 'units'
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [attributes, setAttributes] = useState(INITIAL_ATTRIBUTES);
  const [search, setSearch] = useState("");
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [showAddAttrModal, setShowAddAttrModal] = useState(false);

  // New unit form
  const [newUnit, setNewUnit] = useState({ name: "", shortName: "", baseUnit: "Piece (Pcs)", value: 1 });
  // New attribute form
  const [newAttr, setNewAttr] = useState({ name: "", values: "", category: "Electronics" });

  const handleAddUnit = (e) => {
    e.preventDefault();
    if (!newUnit.name || !newUnit.shortName) return;
    setUnits([
      ...units,
      {
        id: Date.now(),
        name: newUnit.name,
        shortName: newUnit.shortName,
        baseUnit: newUnit.baseUnit,
        operator: "*",
        value: Number(newUnit.value) || 1,
        productsCount: 0,
      },
    ]);
    setShowAddUnitModal(false);
    setNewUnit({ name: "", shortName: "", baseUnit: "Piece (Pcs)", value: 1 });
  };

  const handleAddAttr = (e) => {
    e.preventDefault();
    if (!newAttr.name || !newAttr.values) return;
    setAttributes([
      ...attributes,
      {
        id: Date.now(),
        name: newAttr.name,
        values: newAttr.values.split(",").map((v) => v.trim()).filter(Boolean),
        category: newAttr.category,
      },
    ]);
    setShowAddAttrModal(false);
    setNewAttr({ name: "", values: "", category: "Electronics" });
  };

  return (
    <div className="space-y-6">
      {/* ━━ Tab Switcher ━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-2">
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab("variants")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "variants"
                ? "bg-white text-[#3B7506] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers size={14} />
            <span>Variant Attributes</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("units")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "units"
                ? "bg-white text-[#3B7506] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Scale size={14} />
            <span>Units of Measurement (UOM)</span>
          </button>
        </div>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Variant Attributes"
          value={attributes.length.toString()}
          trend={{ value: "Color, Size, Storage, etc.", positive: true }}
          icon={Palette}
          accent="emerald"
        />
        <StatCard
          label="Active UOM Units"
          value={units.length.toString()}
          trend={{ value: "5 standard units active", positive: true }}
          icon={Scale}
          accent="blue"
        />
        <StatCard
          label="Variant SKU Matrix"
          value="1,240 SKUs"
          trend={{ value: "Generated automatically", positive: true }}
          icon={Tag}
          accent="amber"
        />
        <StatCard
          label="Parent Catalog Items"
          value="480 Products"
          trend={{ value: "Multi-variant enabled", positive: true }}
          icon={Boxes}
          accent="purple"
        />
      </div>

      {activeTab === "variants" ? (
        /* ━━ Attributes Section ━━━━━━━━━━━━━━━━━━━━━ */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Palette size={16} className="text-[#3B7506]" />
              <span>Configured Variant Dimensions</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowAddAttrModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus size={14} />
              <span>Add New Attribute</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributes.map((attr) => (
              <div
                key={attr.id}
                className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-800">{attr.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {attr.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {attr.values.map((v, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#64BD0B]/10 text-[#3B7506] border border-[#64BD0B]/20 text-xs font-semibold"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{attr.values.length} option values</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert(`Editing attribute: ${attr.name}`)}
                      className="text-slate-600 hover:text-slate-900 font-bold"
                    >
                      Edit Values
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ━━ Units of Measurement Table ━━━━━━━━━━━━━ */
        <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              Defined Units &amp; Conversion Multipliers
            </h2>
            <button
              type="button"
              onClick={() => setShowAddUnitModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus size={14} />
              <span>Add New Unit</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Unit Name</th>
                  <th className="py-3.5 px-4 font-mono">Short Code</th>
                  <th className="py-3.5 px-4">Base Unit Equivalent</th>
                  <th className="py-3.5 px-4 text-center">Conversion Math</th>
                  <th className="py-3.5 px-4 text-center">Linked Products</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {unit.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#3B7506]">
                      {unit.shortName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {unit.baseUnit}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold">
                      1 {unit.shortName} = {unit.value} {unit.baseUnit === "Self" ? unit.shortName : "Base Units"}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {unit.productsCount} items
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Edit ${unit.name}`)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                      >
                        <Edit2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ━━ Add Attribute Modal ━━━━━━━━━━━━━━━━━━━━━ */}
      {showAddAttrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800">Add Variant Dimension</h3>
              <button
                type="button"
                onClick={() => setShowAddAttrModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddAttr} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dimension Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Screen Size, Material, Flavor"
                  value={newAttr.name}
                  onChange={(e) => setNewAttr({ ...newAttr, name: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Option Values (comma separated):</label>
                <input
                  type="text"
                  placeholder="e.g. 32-inch, 43-inch, 55-inch, 65-inch"
                  value={newAttr.values}
                  onChange={(e) => setNewAttr({ ...newAttr, values: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Applicable Category:</label>
                <select
                  value={newAttr.category}
                  onChange={(e) => setNewAttr({ ...newAttr, category: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                >
                  <option>Electronics</option>
                  <option>Appliances</option>
                  <option>Apparel & Accessories</option>
                  <option>FMCG / Food</option>
                  <option>All Categories</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAttrModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] text-white font-bold shadow-md"
                >
                  Save Attribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ━━ Add Unit Modal ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800">Add Unit of Measurement</h3>
              <button
                type="button"
                onClick={() => setShowAddUnitModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddUnit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Dozen, Bundle, Meter"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Code / Symbol:</label>
                <input
                  type="text"
                  placeholder="e.g. dzn, bndl, m"
                  value={newUnit.shortName}
                  onChange={(e) => setNewUnit({ ...newUnit, shortName: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Base Unit Equivalent:</label>
                <select
                  value={newUnit.baseUnit}
                  onChange={(e) => setNewUnit({ ...newUnit, baseUnit: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                >
                  <option>Self (Fundamental Base)</option>
                  <option>Piece (Pcs)</option>
                  <option>Kilogram</option>
                  <option>Liter</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Conversion Factor:</label>
                <input
                  type="number"
                  step="any"
                  value={newUnit.value}
                  onChange={(e) => setNewUnit({ ...newUnit, value: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUnitModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] text-white font-bold shadow-md"
                >
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
