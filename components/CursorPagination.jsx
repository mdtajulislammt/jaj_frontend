"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

/**
 * Reusable Cursor & High-Scale Pagination Component
 * Perfectly styled to match the light glassmorphic UI of JAJ ERP.
 * Optimized for datasets from thousands up to 10M-100M records.
 *
 * @param {number} totalItems - Total record count across database
 * @param {number} pageSize - Number of records displayed per page
 * @param {function} onPageSizeChange - Callback when user adjusts page size
 * @param {number} currentPage - 1-based active page index (or cursor position)
 * @param {function} onPageChange - Callback when page / cursor shifts
 * @param {string} [cursorNext] - Optional next cursor token for pure cursor API
 * @param {string} [cursorPrev] - Optional prev cursor token for pure cursor API
 */
export default function CursorPagination({
  totalItems = 0,
  pageSize = 10,
  onPageSizeChange,
  currentPage = 1,
  onPageChange,
  cursorNext,
  cursorPrev,
  className = "",
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  const canPrev = currentPage > 1 || Boolean(cursorPrev);
  const canNext = currentPage < totalPages || Boolean(cursorNext);

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-2xl text-[12.5px] text-slate-600 shadow-sm ${className}`}
    >
      {/* Left: Record Range Summary */}
      <div className="flex items-center gap-3">
        <span className="text-slate-500">
          Showing{" "}
          <strong className="text-slate-900 font-bold">
            {startItem.toLocaleString()}
          </strong>{" "}
          -{" "}
          <strong className="text-slate-900 font-bold">
            {endItem.toLocaleString()}
          </strong>{" "}
          of{" "}
          <strong className="text-[#3B7506] font-extrabold font-mono">
            {totalItems.toLocaleString()}
          </strong>{" "}
          records
        </span>

        {/* Page size dropdown */}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
            <span className="text-slate-400 text-[11.5px]">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1 text-[11.5px] font-semibold focus:outline-none focus:border-[#64BD0B]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>

      {/* Right: Cursor / Page Controls */}
      <div className="flex items-center gap-1.5">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!canPrev}
          title="First Page"
          className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronsLeft size={15} />
        </button>

        {/* Previous */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={!canPrev}
          title="Previous"
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1 text-[12px] font-semibold"
        >
          <ChevronLeft size={14} />
          <span>Prev</span>
        </button>

        {/* Current Page Indicator */}
        <span className="px-3.5 py-1.5 bg-[#64BD0B] text-white font-extrabold rounded-xl text-[12px] shadow-sm">
          {currentPage} / {totalPages}
        </span>

        {/* Next */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={!canNext}
          title="Next"
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1 text-[12px] font-semibold"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!canNext}
          title="Last Page"
          className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  );
}
