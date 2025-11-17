import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名
 * 用于避免类名冲突，智能合并样式
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
