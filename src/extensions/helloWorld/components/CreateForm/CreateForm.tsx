import React from 'react';

//UI components
import { Text } from 'office-ui-fabric-react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { ICreateFormFeriasProps } from './CreateForm.props';
import { useQuantidadeDiasOptions } from '../../../../hooks/useQuantidadeDiasOptions';

const containerStackTokens: IStackTokens = {
  childrenGap: '1rem'
};

const spacingStackTokens: IStackTokens = {
  childrenGap: '1rem',
};

export default function CreateForm(props: ICreateFormFeriasProps): React.ReactElement<ICreateFormFeriasProps> {
  const {
    observacoes,
    observacoesGestor,
    observacoesRH,
    selectedKey,
    status,
    onChangeHandler
  } = props

  const QuantidadeDiasOptions = useQuantidadeDiasOptions()

  const dropdownQuantidadeDiasOptions: IDropdownOption[] = React.useMemo(() => {
    return QuantidadeDiasOptions.map((option, index) => ({
      key: index,
      text: option.text
    }))
  }, [QuantidadeDiasOptions])

  const _onChangeObservacao = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, value?: string)
    : void => onChangeHandler({
      formField: 'Observacao',
      value: value
    })

  const _onChangeQtdDias = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IDropdownOption
  ): void => {
    onChangeHandler({
      formField: 'QtdDias',
      value: option.text})
  }

  let observacoesElement: JSX.Element

  if(status === 'Rejected by manager') {
    observacoesElement= (
      <>
        <TextField label="Observações gestor" 
          value={observacoesGestor} 
          disabled={true}
          multiline rows={3}/>
      </>
    )
  }

  else if(status === "Rejected by HR") {
    observacoesElement = ( 
        <>
          <TextField label="Observações RH" 
            value={observacoesRH} 
            multiline 
            disabled={true}
            rows={3}/>
        </>
      )    
  }

  return (
    <Stack
      tokens={containerStackTokens}>

      <Stack>
        <Text
          variant='xLarge'
          styles={{
            root: {
              color: 'rgb(0, 120, 212)',
            }
          }
          }>Nova soliticação</Text>
      </Stack>

      <Dropdown
          label='Opções de férias'
          options={dropdownQuantidadeDiasOptions}
          onChange={_onChangeQtdDias}
          selectedKey={selectedKey} />
          
      <Stack
        tokens={spacingStackTokens}>
        <TextField label="Observações"
          value={observacoes}
          onChange={_onChangeObservacao}
          multiline rows={3} />
      </Stack>

      <Stack>
        {observacoesElement}
      </Stack>


    </Stack>
  );
}