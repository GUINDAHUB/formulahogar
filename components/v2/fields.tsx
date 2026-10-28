"use client";

import { WarningCircleIcon } from "@phosphor-icons/react";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { useGrouping: "always" } as Intl.NumberFormatOptions).format(Math.round(n));

const slug = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\W+/g, "-").toLowerCase();

export function FieldError({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-[#B42318]">
      <WarningCircleIcon size={16} weight="fill" className="shrink-0" />
      {children}
    </p>
  );
}

export function Progress({ step, total, names }: { step: number; total: number; names: string[] }) {
  return (
    <div aria-label={`Paso ${step} de ${total}`}>
      <p className="text-sm font-semibold text-[#545454]">
        <span className="v2-num text-[#141313]">Paso {step} de {total}</span> · {names[step - 1]}
      </p>
      <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-colors duration-500 ${i < step ? "bg-[#141313]" : "bg-[#E8E8E6]"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function ChipGroup<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  name: string;
  value: T | "";
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  error?: string;
}) {
  return (
    <fieldset aria-invalid={!!error}>
      <legend className="mb-3 text-sm font-semibold text-[#141313]">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <label
              key={o.value}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-[#141313] ${
                selected
                  ? "border-[#141313] bg-[#141313] text-white"
                  : error
                    ? "border-[#B42318] bg-white text-[#141313] hover:border-[#141313]"
                    : "border-[#D6D6D6] bg-white text-[#141313] hover:border-[#141313]"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={selected}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      {error && <FieldError>{error}</FieldError>}
    </fieldset>
  );
}

export function RangeField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  disabled,
  hint,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  disabled?: boolean;
  hint?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const fill = `${((value - min) / (max - min)) * 100}%`;
  const id = `v2-${slug(label)}`;
  const shown = format ? format(value) : `${value >= max ? "Más de " : ""}${fmt(value)} ${suffix ?? ""}`.trim();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-[#141313]">
          {label}
        </label>
        <span className={`v2-num shrink-0 whitespace-nowrap text-base font-bold ${disabled ? "text-[#9D9D9D]" : "text-[#141313]"}`}>
          {shown}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="fh-range mt-3"
        style={{ "--fh-fill": fill } as React.CSSProperties}
        aria-valuetext={shown}
      />
      {hint && <p className="mt-1.5 text-sm leading-snug text-[#545454]">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  prefix,
  suffix,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  maxLength,
  min,
  max,
  step,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
}) {
  const id = `v2-${slug(label)}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#141313]">
        {label}
      </label>
      <div
        className={`flex h-[52px] items-center rounded-[14px] border bg-white transition-colors focus-within:border-[#141313] ${
          error ? "border-[#B42318]" : "border-[#D6D6D6] hover:border-[#9D9D9D]"
        }`}
      >
        {prefix && <span className="pl-4 text-base text-[#545454]">{prefix}</span>}
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-full w-full min-w-0 rounded-[14px] bg-transparent px-4 text-base text-[#141313] caret-[#141313] outline-none placeholder:text-[#9D9D9D] focus-visible:outline-none"
        />
        {suffix && <span className="shrink-0 pr-4 text-sm text-[#545454]">{suffix}</span>}
      </div>
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : hint && <p className="mt-2 text-sm text-[#545454]">{hint}</p>}
    </div>
  );
}
