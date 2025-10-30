import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPriorityColor(priority: "High" | "Medium" | "Low"): string {
  switch (priority) {
    case "High":
      return "#FF4337";
    case "Medium":
      return "#8092DC";
    case "Low":
      return "#0177C7";
    default:
      return "#0177C7";
  }
}

export function getProgressBarColor(progress: number): string {
  if (progress < 33) return "#FF4337";
  if (progress <= 70) return "#FFB546";
  return "#00C3B1";
}

export function getProgressTextColorClass(progress: number): string {
  if (progress < 33) return "text-[#FF4337]";
  if (progress <= 70) return "text-[#FFB546]";
  return "text-[#00C3B1]";
}

export function getBadgeStyle(badge: string): { width: string | number; height: string | number; backgroundColor: string; color: string } {
  switch (badge) {
    case "Creation":
      return { width: 61, height: 20, backgroundColor: "#0177C70D", color: "#0177C7" };
    case "Adaptation":
      return { width: 75, height: 20, backgroundColor: "#8092DC0D", color: "#8092DC" };
    case "Resize":
      return { width: 50, height: 20, backgroundColor: "#00C3B10F", color: "#00C3B1" };
    default:
      return { width: "auto", height: 20, backgroundColor: "#f9f9f9", color: "#646464" };
  }
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}