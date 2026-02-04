"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

export type ISODate = string; // yyyy-mm-dd

function toISO(d?: Date): ISODate {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseISO(s: ISODate) {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export default function SingleDatePicker(props: {
  value: ISODate;
  onChange: (v: ISODate) => void;

  placeholder?: string;
  disabled?: boolean;

  /** popup to hay vừa */
  popoverWidth?: "md" | "lg";
  /** hiển thị mấy tháng */
  months?: 1 | 2;

  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;
}) {
  const {
    value,
    onChange,
    placeholder = "Chọn ngày",
    disabled,
    popoverWidth = "md",
    months = 1,
    className,
    buttonClassName,
    popoverClassName,
  } = props;

  const [open, setOpen] = React.useState(false);
  const selected = React.useMemo(() => parseISO(value), [value]);

  const label = React.useMemo(() => {
    if (!selected) return placeholder;
    return format(selected, "dd/MM/yyyy");
  }, [selected, placeholder]);

  const popW =
    popoverWidth === "lg" ? "w-[340px] sm:w-[420px]" : "w-[300px] sm:w-[360px]";

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center justify-between gap-3",
          "rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm shadow-sm",
          "hover:bg-neutral-50 outline-none focus:ring-2 focus:ring-neutral-300",
          "disabled:cursor-not-allowed disabled:opacity-60",
          buttonClassName
        )}
      >
        <span className={cn("truncate", !selected && "text-neutral-500")}>
          {label}
        </span>
        <span className="text-neutral-500" aria-hidden="true">
          📅
        </span>
      </button>

      {open && !disabled && (
        <>
          {/* click-outside */}
          <button
            aria-label="close"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            className={cn(
              "absolute right-0 mt-2 z-50",
              popW,
              "rounded-3xl border border-black/10 bg-white/95 backdrop-blur shadow-xl",
              popoverClassName
            )}
          >
            <div className="flex items-center justify-between px-4 pt-4">
              <div className="text-sm font-semibold text-neutral-900">
                Chọn ngày
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-2xl px-3 py-1.5 text-xs font-semibold ring-1 ring-black/10 hover:bg-neutral-50"
                  onClick={() => onChange("")}
                >
                  Xóa
                </button>
                <button
                  type="button"
                  className="rounded-2xl px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white hover:opacity-95"
                  onClick={() => setOpen(false)}
                >
                  Xong
                </button>
              </div>
            </div>

            <div className="px-4 pb-4 pt-3">
              <DayPicker
                mode="single"
                numberOfMonths={months}
                selected={selected}
                onSelect={(d) => onChange(toISO(d ?? undefined))}
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="rounded-2xl px-3 py-1.5 text-xs font-semibold ring-1 ring-black/10 hover:bg-neutral-50"
                  onClick={() => onChange(toISO(new Date()))}
                >
                  Hôm nay
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
