"use client";

// 金額入力欄（3桁ごとにカンマを自動表示）。
// type="number" はカンマを表示できないため、type="text" ＋ 整形で実現する。
// value は数値（円）。入力中は数字以外を除去し、カンマ付きで表示する。
import { useEffect, useState } from "react";

const format = (n: number): string => (n > 0 ? n.toLocaleString("ja-JP") : "");

export function MoneyInput({
  value,
  onChange,
  className,
  placeholder,
  min = 0,
  max,
  id,
  ariaLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  id?: string;
  ariaLabel?: string;
}) {
  const [text, setText] = useState(() => format(value));

  // 外部から value が変わったとき（スライダー操作など）に表示を同期する
  useEffect(() => {
    const shown = Number(text.replace(/[^0-9]/g, "")) || 0;
    if (shown !== value) setText(format(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      id={id}
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={text}
      onChange={(e) => {
        const digits = e.target.value.replace(/[^0-9]/g, "");
        let n = digits === "" ? 0 : Number(digits);
        if (max != null && n > max) n = max;
        if (n < min) n = min;
        setText(n > 0 ? n.toLocaleString("ja-JP") : "");
        onChange(n);
      }}
      className={className}
    />
  );
}
