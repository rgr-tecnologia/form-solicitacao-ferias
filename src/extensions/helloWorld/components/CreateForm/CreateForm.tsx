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
import { PeriodItem } from '../PeriodosFeriasList/PeriodosFeriasList.props';
import { PeriodosFeriasList } from '../PeriodosFeriasList/PeriodosFeriasList';
import { useQuantidadeDiasOptions } from '../../../../hooks/useQuantidadeDiasOptions';

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

  const QuantidadeDiasOptions = useQuantidadeDiasOptions()

  const dropdownQuantidadeDiasOptions: IDropdownOption[] = React.useMemo(() => {
    return QuantidadeDiasOptions.map((option, index) => ({
      key: index,
      text: option.text
    }))
  }, [QuantidadeDiasOptions])

  const [selectedOption, setSelectedOption] = React.useState<IDropdownOption>({...dropdownQuantidadeDiasOptions[0]})

  const [periods, setPeriodos] = React.useState<PeriodItem[]>(formData.periods)

  const defaultOption = React.useMemo<IDropdownOption>(() => {
    if(formData.QtdDias) {
      const findDataResult = dropdownQuantidadeDiasOptions.filter((option) => {
        return option.text === formData.QtdDias
      })[0]
  
      if(findDataResult) {
        setSelectedOption(findDataResult)
        return findDataResult
      }

      throw Error("Erro ao consultar dados, QtdDias não deve ser null")
    }
  }, [dropdownQuantidadeDiasOptions])

  React.useEffect(() => {
    const {
      key
    } = selectedOption
    
    const selectedValueKey =  typeof key === "string" ? parseInt(key) : key;    
    const selectedPeriod = QuantidadeDiasOptions[selectedValueKey]
    const totalPeriods = selectedPeriod.periods.length;

    const newPeriods = [...new Array(totalPeriods)]

    const dataToSet: PeriodItem[] = newPeriods.reduce((accumulator: PeriodItem[], _, index) => {
      const periodoAtual = selectedPeriod.periods[index]
      const periodoAnterior = accumulator[index-1]

      const currentDate = new Date()
      const dataInicio = index === 0 ? new Date(currentDate.setDate(currentDate.getDate() + 60)) : periodoAnterior.dataFim
      const dataFim = new Date(dataInicio.getTime())
      dataFim.setDate(dataFim.getDate() + periodoAtual.totalDias)

      accumulator.push({
        dataInicio,
        dataFim,
      })

      return accumulator
    }, [])

    setPeriodos(dataToSet)

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

  const onChangeDataInicio = (index: number, value: Date) => {
    const {
      key
    } = selectedOption

    const selectedValueKey =  typeof key === "string" ? parseInt(key) : key;
    const { periods: quantidadeDiasPeriod } = QuantidadeDiasOptions[selectedValueKey]

    const changedPeriod = periods[index]
    changedPeriod.dataInicio = value
    changedPeriod.dataFim = new Date(changedPeriod.dataInicio.getTime())
    changedPeriod.dataFim.setDate(changedPeriod.dataInicio.getDate() + quantidadeDiasPeriod[index].totalDias)
    
    const updatePeriods = [...periods].slice(index + 1).reduce((accumulator, period, index) => {
      const {
        totalDias
      } = quantidadeDiasPeriod[index + 1]

      const dataInicio = index === 0 ? changedPeriod.dataFim : accumulator[index - 1].dataFim
      const dataFim = new Date(dataInicio.getTime())
      dataFim.setDate(period.dataFim.getDate() + totalDias)

      const newPeriod = {
        dataInicio,
        dataFim
      }

      return [...accumulator, newPeriod]
    }, [])



    const newPeriods = [...[...periods].splice(0, index), changedPeriod, ...updatePeriods]

    onChangeHandler({
      formField: 'Periodos',
      value: newPeriods
    })

    setPeriodos(newPeriods)
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
          label='Opções de férias'
          options={dropdownQuantidadeDiasOptions}
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
        <PeriodosFeriasList periods={periods} onChangeDataInicio={onChangeDataInicio}/>
      </Stack>
    </Stack>
  );
}