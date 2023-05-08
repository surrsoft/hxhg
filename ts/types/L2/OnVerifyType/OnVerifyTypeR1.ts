import { OnVerifyResultTypeR1 } from '../../L1/OnVeriryResultType/OnVerifyResultTypeR1';

/**
 * ID hxhg-[[230508152753]] rev 1 1.0.0 2023-05-08
 */
export interface OnVerifyTypeR1 {
  (valueIn: string): Promise<OnVerifyResultTypeR1>
}