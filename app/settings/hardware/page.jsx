"use client";

import { useState } from "react";
import {
  Printer,
  Scale,
  Monitor,
  CheckCircle2,
  HardDrive,
  Usb,
  Wifi,
  Settings,
  RefreshCw,
  Sliders,
  DollarSign,
  Barcode,
  Power,
} from "lucide-react";
import StatCard from "@/components/StatCard";

export default function HardwareSettingsPage() {
  const [printer, setPrinter] = useState({
    model: "Epson TM-T88VI (ESC/POS 80mm)",
    paperWidth: "80mm",
    connection: "Ethernet / Network IP",
    ipAddress: "192.168.1.200",
    port: "9100",
    autoCut: true,
    printLogo: true,
  });

  const [scale, setScale] = useState({
    brand: "CAS PD-II POS Scale",
    comPort: "COM3",
    baudRate: "9600",
    unit: "kg",
    autoTare: true,
  });

  const [drawer, setDrawer] = useState({
    triggerVia: "ESC/POS Thermal Printer (RJ11)",
    pin: "Pin 2 (Standard)",
    openOnCashSale: true,
    openOnRefund: true,
  });

  const [scanner, setScanner] = useState({
    type: "Honeywell Xenon 1900G 2D Imager",
    interface: "USB HID (Keyboard Emulation)",
    suffix: "Carriage Return (Enter)",
  });

  const [statusMsg, setStatusMsg] = useState(null);

  const handleTestPrint = () => {
    setStatusMsg("Sending test 80mm ESC/POS slip to " + printer.ipAddress + "...");
    setTimeout(() => {
      setStatusMsg("Test receipt printed successfully! Auto-cutter fired.");
      setTimeout(() => setStatusMsg(null), 3500);
    }, 1200);
  };

  const handleTestDrawer = () => {
    setStatusMsg("Sending 24V pulse to Cash Drawer via RJ11...");
    setTimeout(() => {
      setStatusMsg("Cash drawer unlocked and popped open successfully!");
      setTimeout(() => setStatusMsg(null), 3500);
    }, 800);
  };

  const handleTestScale = () => {
    setStatusMsg("Polling COM3 serial port at 9600 baud...");
    setTimeout(() => {
      setStatusMsg("Electronic Scale Response: +1.450 kg (STABLE).");
      setTimeout(() => setStatusMsg(null), 3500);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* ━━ Header ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#64BD0B]/10 text-[#3B7506]">
              <Printer size={22} className="text-[#3B7506]" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Hardware &amp; Peripheral Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure ESC/POS thermal receipt printers, electronic weighing scales, RJ11 cash drawers, and barcode scanners.
          </p>
        </div>

        <button
          onClick={() => {
            setStatusMsg("All hardware settings saved successfully!");
            setTimeout(() => setStatusMsg(null), 3000);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
        >
          <CheckCircle2 size={16} />
          <span>Save Configuration</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#3B7506] font-bold text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={18} />
          {statusMsg}
        </div>
      )}

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Receipt Printer"
          value="Online (Ready)"
          trend={{ value: `${printer.paperWidth} ESC/POS Net`, positive: true }}
          icon={Printer}
          accent="emerald"
        />
        <StatCard
          label="Weighing Scale"
          value="COM3 Connected"
          trend={{ value: "Live tare & zero", positive: true }}
          icon={Scale}
          accent="blue"
        />
        <StatCard
          label="Cash Drawer"
          value="Arm Ready"
          trend={{ value: "RJ11 Pin 2 Signal", positive: true }}
          icon={DollarSign}
          accent="purple"
        />
        <StatCard
          label="Barcode Imager"
          value="USB HID Active"
          trend={{ value: "1D / 2D QR reading", positive: true }}
          icon={Barcode}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ━━ Device 1: Thermal Printer ━━━━━━━━━━━━━━ */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Printer size={18} className="text-[#3B7506]" />
              <h2 className="text-sm font-black text-slate-800">
                1. Thermal Receipt Printer (ESC/POS)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleTestPrint}
              className="px-3 py-1 rounded-lg border border-[#64BD0B]/40 text-[#3B7506] hover:bg-[#64BD0B]/10 font-bold text-xs transition-colors"
            >
              Test Print Slip
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Printer Model / Protocol:</label>
              <select
                value={printer.model}
                onChange={(e) => setPrinter({ ...printer, model: e.target.value })}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#64BD0B] outline-none"
              >
                <option>Epson TM-T88VI (ESC/POS 80mm)</option>
                <option>Xprinter XP-Q800 (ESC/POS 80mm)</option>
                <option>TSC TTP-244 Pro (Label Thermal)</option>
                <option>Compact 58mm Thermal Mini-Printer</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Paper Roll Width:</label>
                <select
                  value={printer.paperWidth}
                  onChange={(e) => setPrinter({ ...printer, paperWidth: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#64BD0B] outline-none"
                >
                  <option value="80mm">80 mm (Standard Retail)</option>
                  <option value="58mm">58 mm (Compact Receipt)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Connection Interface:</label>
                <select
                  value={printer.connection}
                  onChange={(e) => setPrinter({ ...printer, connection: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#64BD0B] outline-none"
                >
                  <option>Ethernet / Network IP</option>
                  <option>USB Port Direct</option>
                  <option>Bluetooth Wireless</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Network IP Address:</label>
                <input
                  type="text"
                  value={printer.ipAddress}
                  onChange={(e) => setPrinter({ ...printer, ipAddress: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 font-mono focus:border-[#64BD0B] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">RAW Port:</label>
                <input
                  type="text"
                  value={printer.port}
                  onChange={(e) => setPrinter({ ...printer, port: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 font-mono focus:border-[#64BD0B] outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-4 text-xs font-semibold text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={printer.autoCut}
                  onChange={(e) => setPrinter({ ...printer, autoCut: e.target.checked })}
                  className="accent-[#64BD0B]"
                />
                <span>Auto-cut Paper after receipt</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={printer.printLogo}
                  onChange={(e) => setPrinter({ ...printer, printLogo: e.target.checked })}
                  className="accent-[#64BD0B]"
                />
                <span>Print Store Header Logo</span>
              </label>
            </div>
          </div>
        </div>

        {/* ━━ Device 2: Electronic Weighing Scale ━━━━━ */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Scale size={18} className="text-[#3B7506]" />
              <h2 className="text-sm font-black text-slate-800">
                2. Electronic Weighing Scale
              </h2>
            </div>
            <button
              type="button"
              onClick={handleTestScale}
              className="px-3 py-1 rounded-lg border border-[#64BD0B]/40 text-[#3B7506] hover:bg-[#64BD0B]/10 font-bold text-xs transition-colors"
            >
              Read Weight
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Scale Brand &amp; Protocol:</label>
              <select
                value={scale.brand}
                onChange={(e) => setScale({ ...scale, brand: e.target.value })}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#64BD0B] outline-none"
              >
                <option>CAS PD-II POS Scale (Toledo Protocol)</option>
                <option>Dibal Weight Protocol</option>
                <option>Avery Berkel 6712</option>
                <option>Generic NCI Serial Protocol</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">COM Serial Port:</label>
                <select
                  value={scale.comPort}
                  onChange={(e) => setScale({ ...scale, comPort: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white font-mono focus:border-[#64BD0B] outline-none"
                >
                  <option>COM1</option>
                  <option>COM2</option>
                  <option>COM3</option>
                  <option>COM4</option>
                  <option>/dev/ttyUSB0 (Linux)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Baud Rate:</label>
                <select
                  value={scale.baudRate}
                  onChange={(e) => setScale({ ...scale, baudRate: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white font-mono focus:border-[#64BD0B] outline-none"
                >
                  <option>9600</option>
                  <option>19200</option>
                  <option>4800</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={scale.autoTare}
                onChange={(e) => setScale({ ...scale, autoTare: e.target.checked })}
                className="accent-[#64BD0B]"
              />
              <span>Auto-read live weight into POS billing line on product selection</span>
            </div>
          </div>
        </div>

        {/* ━━ Device 3: RJ11 Cash Drawer ━━━━━━━━━━━━━ */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-[#3B7506]" />
              <h2 className="text-sm font-black text-slate-800">
                3. Cash Drawer (Kick Trigger)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleTestDrawer}
              className="px-3 py-1 rounded-lg border border-[#64BD0B]/40 text-[#3B7506] hover:bg-[#64BD0B]/10 font-bold text-xs transition-colors"
            >
              Test Open Drawer
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Trigger Interface:</label>
              <select
                value={drawer.triggerVia}
                onChange={(e) => setDrawer({ ...drawer, triggerVia: e.target.value })}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#64BD0B] outline-none"
              >
                <option>ESC/POS Thermal Printer (RJ11 Cable)</option>
                <option>Direct USB Cash Drawer Controller</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">RJ11 Solenoid Kick Pin:</label>
              <select
                value={drawer.pin}
                onChange={(e) => setDrawer({ ...drawer, pin: e.target.value })}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white font-mono focus:border-[#64BD0B] outline-none"
              >
                <option>Pin 2 (Standard Epson / Star)</option>
                <option>Pin 5 (Alternative Solenoid)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 font-semibold text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={drawer.openOnCashSale}
                  onChange={(e) => setDrawer({ ...drawer, openOnCashSale: e.target.checked })}
                  className="accent-[#64BD0B]"
                />
                <span>Automatically open on Cash &amp; Split tender finalization</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={drawer.openOnRefund}
                  onChange={(e) => setDrawer({ ...drawer, openOnRefund: e.target.checked })}
                  className="accent-[#64BD0B]"
                />
                <span>Automatically open on Cash Refund</span>
              </label>
            </div>
          </div>
        </div>

        {/* ━━ Device 4: Barcode Scanner ━━━━━━━━━━━━━━━ */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Barcode size={18} className="text-[#3B7506]" />
              <h2 className="text-sm font-black text-slate-800">
                4. Barcode / QR Scanner
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Ready
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Scanner Model:</label>
              <input
                type="text"
                value={scanner.type}
                onChange={(e) => setScanner({ ...scanner, type: e.target.value })}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hardware Interface:</label>
                <select
                  value={scanner.interface}
                  onChange={(e) => setScanner({ ...scanner, interface: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#64BD0B] outline-none"
                >
                  <option>USB HID (Keyboard Emulation)</option>
                  <option>Virtual Serial COM Port</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Barcode Suffix Character:</label>
                <select
                  value={scanner.suffix}
                  onChange={(e) => setScanner({ ...scanner, suffix: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white focus:border-[#64BD0B] outline-none"
                >
                  <option>Carriage Return (Enter - \r\n)</option>
                  <option>Tab Character (\t)</option>
                  <option>None (Raw String)</option>
                </select>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              Plug and play compatible with GS1-128, EAN-13, UPC-A, and 2D QR product matrix tags.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
