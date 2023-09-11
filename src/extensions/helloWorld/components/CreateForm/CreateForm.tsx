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

export default function CreateForm(props: ICreateFormFeriasProps): React.ReactElement<ICreateFormFeriasProps> {
  const {
    item,
    onChangeHandler
  } = props

  const QuantidadeDiasOptions = useQuantidadeDiasOptions()

  const formData = React.useMemo(() => item, [item])

  const dropdownQuantidadeDiasOptions: IDropdownOption[] = React.useMemo(() => {
    return QuantidadeDiasOptions.map((option, index) => ({
      key: index,
      text: option.text
    }))
  }, [QuantidadeDiasOptions])

  const selectedOption = React.useMemo<IDropdownOption>(() => {
    let defaultOption = dropdownQuantidadeDiasOptions[0]
    if(formData.QtdDias) {
      defaultOption = dropdownQuantidadeDiasOptions.find((option) => {
        return option.text === formData.QtdDias
      })
    }
    return defaultOption
  }, [dropdownQuantidadeDiasOptions, formData])

  const [periods, setPeriodos] = React.useState<PeriodItem[]>(formData.periods)

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
      const DataInicio = index === 0 ? new Date(currentDate.setDate(currentDate.getDate() + 60)) : periodoAnterior.DataFim
      const DataFim = new Date(DataInicio.getTime())
      DataFim.setDate(DataFim.getDate() + periodoAtual.totalDias)

      accumulator.push({
        DataInicio,
        DataFim,
        DecimoTerceiro: false
      })

      return accumulator
    }, [])

    onChangeHandler({
      formField: 'AbonoQuantidadeDias',
      value: selectedPeriod.totalDiasAbono
    })

    onChangeHandler({
      formField: 'periods',
      value: dataToSet
    })

    setPeriodos(dataToSet)


  }, [selectedOption])

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

  const onChangeDataInicio = (index: number, value: Date) => {
    const {
      key
    } = selectedOption

    const selectedValueKey =  typeof key === "string" ? parseInt(key) : key;
    const { periods: quantidadeDiasPeriod } = QuantidadeDiasOptions[selectedValueKey]

    const changedPeriod = periods[index]
    changedPeriod.DataInicio = value
    changedPeriod.DataFim = new Date(changedPeriod.DataInicio.getTime())
    changedPeriod.DataFim.setDate(changedPeriod.DataInicio.getDate() + quantidadeDiasPeriod[index].totalDias)
    
    const updatePeriods = [...periods].slice(index + 1).reduce((accumulator, _, index) => {
      const {
        totalDias
      } = quantidadeDiasPeriod[index + 1]

      const DataInicio = index === 0 ? changedPeriod.DataFim : accumulator[index - 1].DataFim
      const DataFim = new Date(DataInicio.getTime())
      DataFim.setDate(DataFim.getDate() + totalDias)

      const newPeriod = {
        DataInicio,
        DataFim
      }

      return [...accumulator, newPeriod]
    }, [])

    const newPeriods = [...[...periods].splice(0, index), changedPeriod, ...updatePeriods]

    onChangeHandler({
      formField: 'periods',
      value: newPeriods
    })

    setPeriodos(newPeriods)
  }

  const onChangeDecimoTerceiro = (index: number, value: boolean) => {
    const changedPeriod = {...periods[index]}

    const newPeriods = [...periods]
    newPeriods.forEach((period) => period.DecimoTerceiro = false)
    newPeriods[index] = changedPeriod
    newPeriods[index].DecimoTerceiro = value

    onChangeHandler({
      formField: 'periods',
      value: newPeriods
    })

    setPeriodos(newPeriods)
  }

  let observacoes: JSX.Element

  if(formData.Status === 'Rejected by manager') {
    observacoes= (
      <>
        <TextField label="Observações gestor" 
          value={formData.ObservacaoGestor} 
          disabled={true}
          multiline rows={3}/>
      </>
    )
  }

  else if(formData.Status === "Rejected by HR") {
    observacoes = ( 
        <>
          <TextField label="Observações RH" 
            value={formData.ObservacaoRH} 
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
          selectedKey={selectedOption?.key} />
          
      <Stack
        tokens={spacingStackTokens}>
        <TextField label="Observações"
          value={formData.Observacao}
          onChange={_onChangeObservacao}
          multiline rows={3} />
      </Stack>

      <Stack>
        {observacoes}
      </Stack>

      <Stack>
        <PeriodosFeriasList 
          disableDataInicio={false} 
          disableDecimoTerceiro={false}
          periods={periods} 
          onChangeDataInicio={onChangeDataInicio}
          onChangeDecimoTerceiro={onChangeDecimoTerceiro}/>
      </Stack>
    </Stack>
  );
}