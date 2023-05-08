import { SizesPxTypeR1 } from '../../types/L1/SizesPxType/SizesPxTypeR1';

/**
 * Интерпретатор для SizexPxType ([230507102054])
 *
 * ID hxhg-[[230507102411]] rev 1 1.0.0 2023-05-07
 *
 * @param sizes см. hxhg-[230507102054]
 */
export const sizesPxInterpreteR1 = (sizes: SizesPxTypeR1 = {}): { wPx: number, hPx: number } => {
  if (sizes.whPx) {
    return { wPx: sizes.whPx, hPx: sizes.whPx };
  }
  if (sizes.wPx && sizes.hPx) {
    return { wPx: sizes.wPx, hPx: sizes.hPx };
  }
  if (sizes.wPx) {
    return { wPx: sizes.wPx, hPx: sizes.wPx };
  }
  if (sizes.hPx) {
    return { wPx: sizes.hPx, hPx: sizes.hPx };
  }
  return { wPx: 32, hPx: 32 };
};