import { CSSProperties, css } from 'styled-components';
import { ButtonColorsTypeR1 } from '../../types/L2/ButtonColorsType/ButtonColorsTypeR1';
import { SizesPxTypeR1 } from '../../types/L1/SizesPxType/SizesPxTypeR1';
import { sizesPxInterpreteR1 } from '../../utils/sizesPxInterprete/sizesPxInterpreteR1';

/**
 * Стилизатор для <svg> внутри <button>. Меняет цвет svg для состояний normal, hover, disabled, click. Есть опция
 * isLoading - если TRUE то к svg добавляется бесконечная анимация (циклически меняется прозрачность).
 * Требования: У SVG у path не должно быть поля fill.
 *
 * Зависимости: hxhg-[230507102921], hxhg-[230507102054], ...
 *
 * ID hxhg-[[230507110019]] rev 2 1.0.1 2023-05-07
 */
export const SvgButtonBaseStyledR2 = css<{
  colors?: ButtonColorsTypeR1,
  svgSizesPx?: SizesPxTypeR1,
  css?: CSSProperties,
  isLoading?: boolean
}>`
  border: 0;
  border-radius: 0;
  padding: 0;
  cursor: pointer;

  svg {
    width: ${({ svgSizesPx }) => `${sizesPxInterpreteR1(svgSizesPx).wPx}px`};
    height: ${({ svgSizesPx }) => `${sizesPxInterpreteR1(svgSizesPx).hPx}px`};
    fill: ${({ colors }) => (colors?.normal ?? 'unset')};
  }

  &:hover svg, &:hover svg path {
    fill: ${({ colors }) => (colors?.hover ?? colors?.normal ?? 'unset')};
  }

  &:active svg {
    fill: ${({ colors }) => (colors?.click ?? colors?.normal ?? 'unset')};
  }

  &:disabled svg {
    fill: ${({ colors }) => (colors?.disabled ?? colors?.normal ?? 'unset')};
  }

  &:disabled {
    cursor: not-allowed;
  }

  svg {
    animation: fade ${({ isLoading }) => isLoading ? '1.2s' : '0'} infinite;
    animation-timing-function: ease;
  }

  @keyframes fade {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

`;