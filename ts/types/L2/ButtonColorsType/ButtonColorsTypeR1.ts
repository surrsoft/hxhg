import { ColorTypeR1 } from '../../L1/ColorType/ColorTypeR1';

/**
 * Цвета для разных состояний кнопки
 *
 * ID hxhg-[[230507102921]] rev 1 1.0.0 2023-05-07
 *
 * Зависимости: ColorTypeR1 (см. hxhg-[230507102606])
 */
export interface ButtonColorsTypeR1 {
  normal?: ColorTypeR1;
  hover?: ColorTypeR1;
  disabled?: ColorTypeR1;
  click?: ColorTypeR1;
}