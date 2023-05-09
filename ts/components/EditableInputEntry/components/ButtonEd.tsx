import React from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as SvgIconEdit } from '../assets/IconEdit.svg';
import { ReactComponent as SvgIconCheck } from '../assets/IconCheck.svg';
import { ReactComponent as SvgIconClose } from '../assets/IconClose.svg';
import { SvgButtonBaseStyledR2 } from '../../SvgButtonBaseStyled/SvgButtonBaseStyledR2';
import { ButtonColorsTypeR1 } from '../../../types/L2/ButtonColorsType/ButtonColorsTypeR1';

const sizePx = '24px';

const ButtonIn = styled.button`
  ${SvgButtonBaseStyledR2};
  
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${sizePx};
  min-height: ${sizePx};
  background-color: transparent;
`;

interface Props {
  icon: 'edit' | 'confirm' | 'cancel';
  onClick: () => void;
  disabled: boolean;
  isLoading?: boolean;
}

const colors: ButtonColorsTypeR1 = {
  normal: 'black',
  disabled: 'silver',
  hover: 'red',
  click: 'yellow'
}

export function ButtonEd({ icon, onClick, isLoading, disabled }: Props) {
  return <ButtonIn
    colors={colors}
    svgSizesPx={{whPx: 14}}
    onClick={onClick}
    isLoading={isLoading}
    disabled={disabled}
  >
    {icon === 'edit' && <SvgIconEdit />}
    {icon === 'confirm' && <SvgIconCheck />}
    {icon === 'cancel' && <SvgIconClose />}
  </ButtonIn>;
}
