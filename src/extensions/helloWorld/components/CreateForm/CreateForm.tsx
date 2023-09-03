import React from 'react';
/*import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';
import {
  SPHttpClient,
} from '@microsoft/sp-http';*/

//UI components
import { Text } from 'office-ui-fabric-react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { ICreateFormFeriasProps } from './CreateForm.props';

import { QuantidadeDiasOptions } from '../../../../enums/QuantidadeDiasOptions';
import { PeriodItem } from '../PeriodosFeriasList/PeriodosFeriasList.props';
import { PeriodosFeriasList } from '../PeriodosFeriasList/PeriodosFeriasList';

const containerStackTokens: IStackTokens = {
  childrenGap: '1rem'
};

const spacingStackTokens: IStackTokens = {
  childrenGap: '1rem',
};

export default function FormSolicitacaoFerias(props: ICreateFormFeriasProps): React.ReactElement<ICreateFormFeriasProps> {
  const {
    item: formData,
    onChangeHandler
  } = props

  const options = React.useMemo(() => {
    const QuantidadeDiasOptions: Record<number, QuantidadeDiasOptions> = {
      1: '30',
      2: '20 + 10',
      3: '20 + 10 (abono)',
      4: '15 + 5 + 10 (abono)',
      5: '15 + 15',
      6: '20 + 5 + 5',
    };

    const MappedQuantidadeDiasOptions: IDropdownOption[] = []

    for (const key in QuantidadeDiasOptions) {
      if(QuantidadeDiasOptions[key]) {
        MappedQuantidadeDiasOptions.push({key, text: QuantidadeDiasOptions[key]})
      }    
    }
    return MappedQuantidadeDiasOptions
  }, [])

  const [periods, setPeriods] = React.useState<typeof formData.periods>([])
  const [selectedOption, setSelectedOption] = React.useState<IDropdownOption>({...options[0]})

  const defaultOption = React.useMemo<IDropdownOption>(() => {
    if(formData.QtdDias) {
      const findDataResult = options.filter((option) => {
        return option.text === formData.QtdDias
      })[0]
  
      if(findDataResult) {
        setSelectedOption(findDataResult)
        return findDataResult
      }

      throw Error("Erro ao consultar dados, QtdDias não deve ser null")
    }
  }, [])

  React.useEffect(() => {
    const {
      key
    } = selectedOption

    let totalPeriods = 0;
    const selectedValue =  typeof key === "string" ? parseInt(key) : key;    
    const baseItemData: PeriodItem = {
      dataInicio: new Date(),
      dataFim: new Date(),
      status: 'In review'
    }

    switch(selectedValue) {
      case 1:
        totalPeriods = 1
        break
      case 2:
        totalPeriods = 2
        break
      case 3:
        totalPeriods = 1
        break
      case 4:
      case 5:
        totalPeriods = 2
        break
      case 6:
        totalPeriods = 3
        break
    }

    const dataToSet = [...new Array(totalPeriods)].map(() => ({...baseItemData}))

    setPeriods([...dataToSet])
  }, [selectedOption])

  const _onChangeAbono = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean)
    : void => onChangeHandler({
      formField: 'Abono',
      value: isChecked
    })

  const _onChangeSalario = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean)
    : void => onChangeHandler({
      formField: 'DecimoTerceioSalario',
      value: isChecked
    })

  /*const _onChangeDataInicio = (value?: Date): void => {
    if ((value.getDay() === DayOfWeek.Friday) || (value.getDay() === DayOfWeek.Saturday)  || (value.getDay() === DayOfWeek.Sunday) ){
      alert('Não é permitido agendar férias com início às sextas-feiras, sábados ou domingos.');        
        onChangeHandler({
          formField: 'DataInicio',
          value: ''
        });
      } 
      else {
        onChangeHandler({
          formField: 'DataInicio',
          value: value
        });
    }
  };*/

  const _onChangeObservacao = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, value?: string)
    : void => onChangeHandler({
      formField: 'Observacao',
      value: value
    })

  const _onChangeQtdDias = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IDropdownOption
  ): void => {
    setSelectedOption(option)
    onChangeHandler({
      formField: 'QtdDias',
      value: option.text})
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

      <Stack
        tokens={spacingStackTokens}>
        <Dropdown
          label='Qtde. de Dias'
          options={options}
          onChange={_onChangeQtdDias}
          selectedKey={selectedOption?.key}
          defaultSelectedKey={defaultOption?.key} />
      </Stack>

      <Stack
        horizontal
        tokens={spacingStackTokens}>
        {(formData.QtdDias === '10 x 14 x 6' || formData.QtdDias === '20 x 10') &&
          <Checkbox label="Abono" checked={formData.Abono} onChange={_onChangeAbono} />}
        <Checkbox label="13° salário" checked={formData.DecimoTerceioSalario} onChange={_onChangeSalario} />
      </Stack>

      <Stack
        tokens={spacingStackTokens}>
        <TextField label="Observações"
          value={formData.Observacao}
          onChange={_onChangeObservacao}
          multiline rows={3} />
      </Stack>

      <Stack>
        <PeriodosFeriasList periods={periods} />
      </Stack>
    </Stack>
  );
}