import * as React from 'react';

import { Text } from '@fluentui/react/lib/Text';
import { Stack, IStackTokens, TextField, Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import { IViewFormSolicitacaoFeriasProps } from './ViewForm.props';
import { useQuantidadeDiasOptions } from '../../../../hooks/useQuantidadeDiasOptions';

export default function ViewForm(props: IViewFormSolicitacaoFeriasProps)
: React.ReactElement<IViewFormSolicitacaoFeriasProps> {
  const { 
    isUserManager,
    isMemberOfHR,
    observacoes,
    observacoesGestor,
    observacoesRH,
    status,
    selectedKey,
    onChangeQuantidadeDias,
    onChangeObservacoesGestor,
    onChangeObservacaoRH
  } = props

  const QuantidadeDiasOptions = useQuantidadeDiasOptions()

  const dropdownQuantidadeDiasOptions: IDropdownOption[] = React.useMemo(() => {
    return QuantidadeDiasOptions.map((option, index) => ({
      key: index,
      text: option.text
    }))
  }, [QuantidadeDiasOptions])

  const containerStackTokens: IStackTokens = { childrenGap: 5 };

  const spacingStackTokens: IStackTokens = {
    childrenGap: '1.5rem',
  };

  const _onChangeQtdDias = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IDropdownOption) : void => {
    onChangeQuantidadeDias(option.text)
  }

  let observacoesElement: JSX.Element

  if(isUserManager && status === 'In review by manager') {
    observacoesElement = (
      <>
        <TextField label="Observações gestor" 
          value={observacoesGestor} 
          onChange={onChangeObservacoesGestor}
          multiline rows={3}/>
      </>
    )
  }

  else if(isMemberOfHR && status === "In review by HR") {
    observacoesElement = ( 
        <>
          <TextField label="Observações gestor" 
            value={observacoesGestor} 
            onChange={onChangeObservacoesGestor}
            disabled={true}
            multiline rows={3}/>
          <TextField label="Observações RH" 
            value={observacoesRH}
            onChange={onChangeObservacaoRH}
            multiline rows={3}/>
        </>
      )    
  }

  let opcoesFeriasElement: JSX.Element;

  if(isMemberOfHR && status === "Approved by HR" || status === "Edited by HR") {
    opcoesFeriasElement = (
      <>
        <Dropdown
          label='Opções de férias'
          options={dropdownQuantidadeDiasOptions}
          onChange={_onChangeQtdDias}
          selectedKey={selectedKey} />
      </>
    )
  }
  else {
    opcoesFeriasElement = (
      <>
        <Dropdown
          label='Opções de férias'
          options={dropdownQuantidadeDiasOptions}
          selectedKey={selectedKey} 
          disabled={true}/>
      </>
    )
  }

  return (
    <Stack tokens={containerStackTokens}>
      <Stack>
        <Text variant='xLarge' styles={{root: {color: 'rgb(0, 120, 212)'}}}>Soliticação a ser avalidada</Text>
      </Stack>

      <Stack>
        {opcoesFeriasElement}
      </Stack>

      <Stack>
        <TextField label="Observações" 
              value={observacoes} 
              onChange={onChangeObservacaoRH}
              disabled={true}
              multiline 
              rows={3}/>
      </Stack>

      <Stack 
        tokens={spacingStackTokens}>
          {observacoesElement}
      </Stack>
    </Stack>
  );
}