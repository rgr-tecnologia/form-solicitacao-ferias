import * as React from 'react';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

import {
  SPHttpClient,
} from '@microsoft/sp-http';

//UI components
import { DatePicker, Text } from 'office-ui-fabric-react';

import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';

import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';

import { Checkbox } from '@fluentui/react/lib/Checkbox';

//Types
import IListSolicitacaoFeriasItem from './SoliticitacaoFerias';
import { IFormOnChangeHandlerProps } from './FormSolicitacaoFerias'

export interface ICreateFormFeriasProps {
  context: FormCustomizerContext;
  item: IListSolicitacaoFeriasItem;
  onChangeHandler: (props: IFormOnChangeHandlerProps) => void;
}

const containerStackTokens: IStackTokens = { 
  childrenGap: '1rem'
};

const spacingStackTokens: IStackTokens = {
  childrenGap: '1rem',
};

const datePickerStyles = {
  root: {
    width: '50%'
  }
}

async function getListColumnChoices(
  context: FormCustomizerContext, 
  columnName: string
  ): Promise<string[]> {

  const { guid } = context.list;

  const response = await context.spHttpClient
  .get(
    context.pageContext.web.absoluteUrl + `/_api/web/lists(guid'${guid}')/fields?$filter=InternalName eq '${columnName}'`,
    SPHttpClient.configurations.v1, {
    headers: {
      accept: 'application/json;odata.metadata=none'
    }
  })

  return (await response.json()).value.shift().Choices
}

export default function FormSolicitacaoFerias({
  context,
  item: formData,
  onChangeHandler
}: ICreateFormFeriasProps): React.ReactElement<ICreateFormFeriasProps> {

  const [options, setOptions] = React.useState<IDropdownOption[]> ([])

  React.useEffect(()=> {
    getListColumnChoices(context, 'QtdDias')
    .then(choices => {
      setOptions(choices.map((choice) => {
        return {
          key: choice,
          text: choice
        }
      }))
    })
    .catch(error => console.error(error))
  }, [])

  const _onChangeAbono= (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean)
  : void => onChangeHandler({
      formField: 'Abono',
      value: isChecked
    })

  const _onChangeSalario= (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean)
  : void => onChangeHandler({
      formField: 'DecimoTerceioSalario',
      value: isChecked
    })  
  
  const _onChangeDataInicio= (value?: Date)
  : void => onChangeHandler({
    formField: 'DataInicio',
    value: value
  })
  
  const _onChangeDataFim= (value?: Date)
  : void => onChangeHandler({
    formField: 'DataFim',
    value: value
  })

  const _onChangeObservacao= (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, value?: string)
  : void => onChangeHandler({
    formField: 'Observacao',
    value: value
  })

  const _onChangeQtdDias = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IDropdownOption
  ) :void => onChangeHandler({
    formField: 'QtdDias',
    value: option.text
  })

  const _onFormatDate = (date: Date): string => date.toLocaleDateString()

  return (
    <Stack
      tokens={containerStackTokens}>

      <Stack>
        <Text 
        variant='xLarge' 
        styles={{
          root: {
            color: 'rgb(0, 120, 212)',
            }}
        }>Nova soliticação</Text>
      </Stack>

      <Stack
        horizontal
        tokens={spacingStackTokens}>
        <DatePicker 
          label="Data de Início"
          styles={datePickerStyles}
          value={formData.DataInicio}
          onSelectDate={_onChangeDataInicio}
          formatDate={_onFormatDate}/>
        <DatePicker 
          label="Data de Fim"
          styles={datePickerStyles}
          value={formData.DataFim}
          onSelectDate={_onChangeDataFim}
          formatDate={_onFormatDate}/>
      </Stack>

      <Stack
        tokens={spacingStackTokens}>
        <Dropdown 
          label='Qtde. de Dias'
          options={options}
          onChange={_onChangeQtdDias}
          selectedKey={formData.QtdDias ? formData.QtdDias : options[0]?.key}
          defaultSelectedKey={formData.QtdDias ? formData.QtdDias : options[0]?.key}/>
      </Stack>

      <Stack
      horizontal
      tokens={spacingStackTokens}>
        <Checkbox label="Abono" checked={formData.Abono} onChange={_onChangeAbono} />
        <Checkbox label="13° salário" checked={formData.DecimoTerceioSalario} onChange={_onChangeSalario} />
      </Stack>

      <Stack 
        tokens={spacingStackTokens}>
        <TextField label="Observações" 
          value={formData.Observacao} 
          onChange={_onChangeObservacao}
          multiline rows={3}/>
      </Stack>
    </Stack>
  );
}