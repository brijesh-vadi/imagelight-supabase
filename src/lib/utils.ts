import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date) => {
  return new Date(date)
    .toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s?(am|pm)/i, (m) => m.toUpperCase());
};

export const shortenText = (text: string, length: number) => {
  if (text.length > length) {
    return `${text.slice(0, length)} ...`;
  }
  return text.slice(0, length);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};
