import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { useEventListener } from 'usehooks-ts';

import { OnVerifyTypeR1 } from '../../types/L2/OnVerifyType/OnVerifyTypeR1';
import { ButtonEd } from './components/ButtonEd';

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const BaseLineStyled = styled.div`
  display: flex;
`;

const ErrorsLineStyled = styled.div`
  display: flex;
  color: red;
  font-size: 12px;
`;

const ComponentWrapperStyled = styled.div`
  display: flex;
`;

const ButtonsContainerStyled = styled.div<{ gap: number }>`
  display: flex;
  gap: 6px;
  margin-left: ${({ gap }) => gap}px;
  justify-content: center;
  align-items: center;
`;

const StagingElemStyled = styled.div`
  display: flex;
`;

export enum StandingEnum {
  INITIAL = 'INITIAL',
  EDIT = 'EDIT'
}

interface Props {
  /** начальное значение */
  initialValue?: string;
  /** JSX-интерполяция для состояния {@link StandingEnum.INITIAL}; val это текущее значение, изначально берётся
   * из {@param initialValue} */
  jsxInitialInterpolation: (val: string) => ReactNode;
  /** JSX для состояния {@link StandingEnum.EDIT} */
  jsxEdit: ReactNode;
  /** клиент может указать здесь ref на инпут из jsxEdit */
  inputRef: RefObject<HTMLInputElement>;
  isBtnEditDisabled?: boolean;
  isBtnSaveDisabled?: boolean;
  isBtnCancelDisabled?: boolean;
  isBtnEditHidden?: boolean;
  isBtnSaveHidden?: boolean;
  isBtnCancelHidden?: boolean;
  /** исполнитель должен вызвать это когда компонент переходит из состояния EDIT в состояние INITIAL не в результате
   * успешного завершения редактирования */
  onCancel?: () => void;
  /** исполнитель должен вызывать этот колбэк при каждом начале редактирования */
  onStartEdit?: () => void;
  /**
   * клиент олжен проверить значение valueIn, и если оно валидное, выполнить нужные действия и вернуть { isSuccess: true, ... }.
   * valueOut может быть таким же как valueIn или отличаться от него если нужно.
   */
  onConfirm?: OnVerifyTypeR1;
  /**
   * клиент должен проверить val и вернуть пустую строку если всё хорошо, иначе должен вернуть текст, который
   * исполнитель должен показать как ошибку
   * @param val
   */
  onChange?: (val?: string) => Promise<string>;
  /** исполнитель должен вызывать это при успешном завершении редактирования, передавая valueOut полученный по
   * результатам onConfirm() */
  onDone?: (val: string) => void;
  /** опции */
  options?: EditableInputEntryOptionsType;
}

export interface EditableInputEntryOptionsType {
  /** клиент может указать здесь зазор между "телом" и кнопками */
  gapPx?: number;
  /** если truthy то даже если текст не поменялся, всё равно будет выполнен флов как будто изменение было */
  isIgnoreNoChanged?: boolean;
}

/**
 * Компонент переключения между двумя состояними - "просто отображения - INITIAL" и "редактирования - EDIT".
 * Содержит кнопку "редактировать", при нажатии на которую
 * компонент переходит в режим редактирования, в котором пользователь может сделать необходимые правки текста input-а.
 *
 * Переключает между двумя компонентами - jsxInitialInterpolation и jsxEdit.
 * jsxEdit должен содержать элемент input, ref на который нужно передать в пропс inputRef.
 *
 * Рисует кнопки "редактировать", "сохранить", "отменить".
 * Подгоняет длину input под содержимое.
 *
 * NPM ЗАВИСИМОСТИ:
 * - react@17.0.1
 * - styled-components@5.1.26
 * - usehooks-ts@2.9.1
 *
 * ID [[230509180900]] rev 1 1.0.0 2023-05-09
 */
export function EditableInputEntryR1(props: Props) {
  const {
    jsxInitialInterpolation,
    jsxEdit,
    onCancel,
    onStartEdit,
    onConfirm,
    onChange,
    onDone,
    isBtnEditDisabled,
    isBtnCancelDisabled,
    isBtnSaveDisabled,
    isBtnEditHidden,
    isBtnCancelHidden,
    isBtnSaveHidden,
    options,
    inputRef,
    initialValue = '',
  } = props;
  const [standingLocal, setStandingLocal] = useState<StandingEnum>(StandingEnum.INITIAL);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrShowed, setIsErrShowed] = useState(false);
  const [errText, setErrText] = useState<string | undefined | null>('');
  const [inputScrollWithOnStart, setInputScrollWithOnStart] = useState(0);
  // значение на момент начала редактирования, чтобы вернуться к нему в случае cancel
  const [valueMemo, setValueMemo] = useState<string>('');
  const [valueLocal, setValueLocal] = useState<string>(initialValue);

  const isInitial = standingLocal === StandingEnum.INITIAL;
  const isEdit = standingLocal === StandingEnum.EDIT;

  const inputCr = inputRef.current;

  async function changeLocal(val: string) {
    const errString = await onChange?.(val);
    if (errString) {
      setIsErrShowed(true);
      setErrText(errString);
    }
  }

  useEffect(() => {
    if (inputCr && !inputCr.defaultValue) {
      inputCr.defaultValue = initialValue;
    }
  }, [inputCr, initialValue]);

  useEffect(() => {
    if (inputCr?.defaultValue && !valueMemo) {
      setValueMemo(inputCr.defaultValue);
    }
  }, [inputCr?.defaultValue]);

  // старт редактирования
  const handleBtnEdit = async () => {
    setIsErrShowed(false);
    setStandingLocal(StandingEnum.EDIT);
    onStartEdit?.();
    // --- проверка при старте редактирования, так как начальное значение сразу может быть невалидным
    await changeLocal(valueLocal);
    // ---
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    // --- управление длиной (шириной) инпута
    setTimeout(() => {
      const input = inputRef.current;
      setInputScrollWithOnStart(input?.scrollWidth ?? 0);
      if (input?.scrollWidth) {
        input.style.width = `${input.scrollWidth}px`;
      }
    }, 0);
  };

  const handleBtnSave = async () => {
    setIsErrShowed(false);
    const inputCur = inputRef.current;

    // --- если значение не поменялось
    if (inputCur?.value && inputCur.value === valueMemo && !options?.isIgnoreNoChanged) {
      setStandingLocal(StandingEnum.INITIAL);
      return;
    }

    // --- onConfirm
    if (!onConfirm) return true;
    setIsLoading(true);
    inputCur?.setAttribute('disabled', 'true');
    const { isSuccess, errorText, valueOut } = await onConfirm(inputCur?.value || '');
    inputCur?.removeAttribute('disabled');
    setIsLoading(false);

    // ---
    if (isSuccess) {
      setValueLocal(valueOut);
      if (inputCur) {
        inputCur.value = valueOut;
        inputCur.defaultValue = valueOut;
        setValueMemo(valueOut);
      }
      setStandingLocal(StandingEnum.INITIAL);
      onDone?.(valueOut);
    } else {
      setErrText(errorText);
      setIsErrShowed(true);
    }
  };

  const handleBtnCancel = () => {
    setIsErrShowed(false);
    if (inputRef.current) {
      inputRef.current.value = valueMemo;
    }
    setStandingLocal(StandingEnum.INITIAL);
    onCancel?.();
  };

  const handleOnKeyDown = async (event: KeyboardEvent) => {
    switch (event.code) {
      case 'Enter':
        await handleBtnSave();
        break;
      case 'Escape':
        await handleBtnCancel();
        break;
    }
  };

  const handleOnChange = async (event: any) => {
    setIsErrShowed(false);
    const val = (event.target as any)?.value || '';
    await changeLocal(val);

    // --- подгонка ширины инпута под содержимое
    const input = inputRef.current;
    if (input?.scrollWidth && !inputScrollWithOnStart) {
      setInputScrollWithOnStart(input.scrollWidth);
    }
    if (input && input.scrollWidth > inputScrollWithOnStart) {
      input.style.width = `${input.scrollWidth}px`;
    }
  };

  const defaultRef = useRef(null);
  useEventListener('keydown', handleOnKeyDown, inputRef || defaultRef);
  useEventListener('input', handleOnChange, inputRef || defaultRef);

  return <ContainerStyled>
    <BaseLineStyled>
      <ComponentWrapperStyled>
        <StagingElemStyled hidden={!isInitial}>{jsxInitialInterpolation(valueLocal)}</StagingElemStyled>
        <StagingElemStyled hidden={!isEdit}>{jsxEdit}</StagingElemStyled>
      </ComponentWrapperStyled>
      <ButtonsContainerStyled gap={options?.gapPx ?? 0}>
        {!isLoading && isInitial && !isBtnEditHidden &&
          <ButtonEd icon="edit" onClick={handleBtnEdit} disabled={isBtnEditDisabled || isLoading} />}
        {isEdit && !isBtnSaveHidden &&
          <ButtonEd
            icon="confirm"
            onClick={handleBtnSave}
            disabled={isBtnSaveDisabled || isLoading || isErrShowed}
            isLoading={isLoading}
          />}
        {!isLoading && isEdit && !isBtnCancelHidden &&
          <ButtonEd icon="cancel" onClick={handleBtnCancel} disabled={isBtnCancelDisabled || isLoading} />}
      </ButtonsContainerStyled>
    </BaseLineStyled>
    {isErrShowed && errText && !isInitial && <ErrorsLineStyled>{errText}</ErrorsLineStyled>}
  </ContainerStyled>;
}
