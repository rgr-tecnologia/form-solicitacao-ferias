import * as React from 'react';

//UI components
import { Stack, IStackTokens, IStackStyles } from '@fluentui/react/lib/Stack';
import SolicitacoesList from '../SolicitacoesList/SolicitacoesList';

//Forms components
import CreateForm from '../CreateForm/CreateForm'
import ViewForm from '../ViewForm/ViewForm'

//Types
import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';
import { DayOfWeek, Label } from 'office-ui-fabric-react';
import { IFormSolicitacaoFeriasProps } from './FormSolicitacaoFerias.props';
import { FormButtons } from '../FormButtons/FormButtons';
import { useQuantidadeDiasOptions } from '../../../../hooks/useQuantidadeDiasOptions';
import { PeriodosFeriasList } from '../PeriodosFeriasList/PeriodosFeriasList';
import { QuantidadeDiasOption, QuantidadeDiasOptionText } from '../../../../enums/QuantidadeDiasOption';
import { PeriodItem } from '../PeriodosFeriasList/PeriodosFeriasList.props';

export interface IFormOnChangeHandlerProps {
  formField: keyof IListSolicitacaoFeriasItem;
  value: any;
}

export default function FormSolicitacaoFerias(props: IFormSolicitacaoFeriasProps)
: React.ReactElement<IFormSolicitacaoFeriasProps> {
  const {
    displayMode,
    onSave,
    onClose,
    isUserManager,
    isMemberOfHR,
    isAuthor,
    userItems,
    item,
  } = props

  const {
    Status,
    periods
  } = item
  
  const [formData, setFormData] = React.useState<IListSolicitacaoFeriasItem>(item)
  const [errorList, setErrorlist] = React.useState<string[]>([])

  const QuantidadeDiasOptions = useQuantidadeDiasOptions()

  const minDate = React.useMemo(() => {    
    const minDate = 
      formData.Status === 'Approved by HR' || 
      formData.Status === 'Edited by HR' && isMemberOfHR ? 
      new Date() : new Date(new Date().setDate(new Date().getDate() + 60))

    return minDate
  }, [])

  const [periodos, setPeriodos] = React.useState<PeriodItem[]>(periods)
  

  const createPeriods = React.useCallback((quantidadeDias: QuantidadeDiasOption, minDate: Date) => {
    const { periods } = quantidadeDias
    const totalPeriods = periods.length;
  
    const basePeriods = [...new Array(totalPeriods)]
  
    const newPeriods: PeriodItem[] = basePeriods.reduce((accumulator: PeriodItem[], _, index) => {
      const periodoAtual = periods[index]
      const periodoAnterior = accumulator[index-1]
  
      const DataInicio = index === 0 ? minDate : periodoAnterior.DataFim
      const DataFim = new Date(DataInicio.getTime())
      DataFim.setDate(DataFim.getDate() + periodoAtual.totalDias)
  
      accumulator.push({
        DataInicio,
        DataFim,
        DecimoTerceiro: false
      })
  
      return accumulator
    }, [])
  
    return newPeriods
  }, [formData.QtdDias, minDate])

  React.useEffect(() => {
    setFormData({
      ...formData,
      periods: periodos
    })
  }, [periodos])

  React.useEffect(() => {
    if(!formData.periods || formData.periods.length === 0) {
      const selectedQuantidadeDias = QuantidadeDiasOptions.find((option) => {
        return option.text === formData.QtdDias
      })
  
      const newPeriods = createPeriods(selectedQuantidadeDias, minDate)
  
      setPeriodos(newPeriods)
    }
  }, [formData.periods])

  const enableDataInicio = 
    formData.Status === 'Draft' || 
    formData.Status === 'Rejected by HR' || 
    formData.Status === 'Rejected by manager' && isAuthor ||
    formData.Status === 'Approved by HR' || formData.Status == 'Edited by HR' && isMemberOfHR

  const enableDecimoTerceiro = 
    formData.Status === 'Draft' || 
    formData.Status === 'Rejected by HR' || 
    formData.Status === 'Rejected by manager' && isAuthor ||
    formData.Status === 'Approved by HR' || formData.Status == 'Edited by HR' && isMemberOfHR

  const containerStackTokens: IStackTokens = { 
    childrenGap: 5,
    padding: '1rem'
  };

  const spacingStackTokens: IStackTokens = {
    childrenGap: 5,
  };

  const containerStackStyles: IStackStyles = {
    root: {
      minWidth: 'max-content',
    }
  }

  const validateDataInicio = React.useCallback(() => {
    let errors = []

    errors = formData.periods.reduce((accumulator, period) => {
      if ((period.DataInicio.getDay() === DayOfWeek.Friday) || 
        (period.DataInicio.getDay() === DayOfWeek.Saturday)  || 
        (period.DataInicio.getDay() === DayOfWeek.Sunday) ){          
          accumulator.push('Não é permitido agendar férias com início às sextas-feiras, sábados ou domingos.')
      } 
      
      return accumulator
    }, [])

    return errors
  }, [formData])

  const validateObservacao = React.useCallback(() => {
    let errors = []

    if (!formData.Observacao) {
      errors.push('O campo "Observações" é obrigatório.')
    }

    return errors
  }, [formData.Observacao])

  const validateObservacaoGestor = React.useCallback(() => {
    let errors = []

    if (!formData.ObservacaoGestor) {
      errors.push('O campo "Observações gestor" é obrigatório.')
    }

    return errors
  }, [formData.ObservacaoGestor])

  const validateObservacaoRH = React.useCallback(() => {
    let errors = []

    if (!formData.ObservacaoRH) {
      errors.push('O campo "Observações RH" é obrigatório.')
    }

    return errors
  }, [formData.ObservacaoRH])

  const _onSend= (): void => {
    const errorList = [...validateDataInicio(), ...validateObservacao()]
    const isFormValid = errorList.length > 0 ? false : true

    if(!isFormValid) {
      setErrorlist(errorList)
      throw Error(errorList[0]);      
    }

    onSave({
      ...formData,
      Status: 'In review by manager'
    })    
  }

  const onApproveManager= (): void => {
    const errorList = [...validateObservacaoGestor()]
    const isFormValid = errorList.length > 0 ? false : true

    if(!isFormValid) {
      setErrorlist(errorList)
      throw Error(errorList[0]);
    }
  
    onSave({
      ...formData,
      Status: 'Approved by manager'
    })
  }

  const onRejectManager= (): void => {
    const errorList = [...validateObservacaoGestor()]
    const isFormValid = errorList.length > 0 ? false : true

    if(!isFormValid) {
      setErrorlist(errorList)
      throw Error(errorList[0]);
    }
    
    onSave({
      ...formData,
      Status: 'Rejected by manager'
    })
  }

  const onApproveHR= (): void => {
    const errorList = [...validateObservacaoRH()]
    const isFormValid = errorList.length > 0 ? false : true

    if(!isFormValid) {
      setErrorlist(errorList)
      throw Error(errorList[0]);
    }
  
    onSave({
      ...formData,
      Status: 'Approved by HR'
    })
  }

  const onRejectHR= (): void => {
    const errorList = [...validateObservacaoRH()]
    const isFormValid = errorList.length > 0 ? false : true

    if(!isFormValid) {
      setErrorlist(errorList)
      throw Error(errorList[0]);
    }
  
    onSave({
      ...formData,
      Status: 'Rejected by HR'
    })
  }

  const onSaveHR= (): void => {
    const errorList = validateDataInicio()
    const isFormValid = errorList.length > 0 ? false : true

    if(!isFormValid) {
      setErrorlist(errorList)
      throw Error(errorList[0]);      
    }

    onSave({
      ...formData,
      Status: 'Edited by HR'
    })
  }

  const _onChange= ({formField, value} : any): void => {
    const newFormData= {...formData} as any
    newFormData[formField] = value

    setFormData({
      ...newFormData,     
    })
  }

  const onChangeObservacaoGestor= (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, value?: string)
  : void => _onChange({
    formField: 'ObservacaoGestor',
    value: value
  })

  const onChangeObservacaoRH= (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, value?: string)
  : void => _onChange({
    formField: 'ObservacaoRH',
    value: value
  }) 

  const onChangeQtdDias = (selectedOptionText: QuantidadeDiasOptionText) => {
    const selectedQuantidadeDias = QuantidadeDiasOptions.find((option) => {
      return option.text === selectedOptionText
    })
    const { totalDiasAbono } = selectedQuantidadeDias

    const newPeriods = createPeriods(selectedQuantidadeDias, minDate)

    setPeriodos(newPeriods)

    setFormData({
      ...formData,
      'AbonoQuantidadeDias': totalDiasAbono,
      'QtdDias': selectedOptionText
    })
  }

  const onChangeDataInicio = (index: number, value: Date): void => {
    const currentOption = QuantidadeDiasOptions.find((option) => {
      return option.text === formData.QtdDias
    })

    const newPeriods = [...formData.periods]
    newPeriods[index].DataInicio = value
    newPeriods[index].DataFim = new Date(value.getTime())
    newPeriods[index].DataFim.setDate(newPeriods[index].DataFim.getDate() + currentOption.periods[index].totalDias)

    const periodsToUpdate = newPeriods.slice(index + 1)
    const totalPeriodsToUpdate = periodsToUpdate.length
    
    const updatedPeriods = periodsToUpdate.reduce((accumulator, _, index) => {
      const {
        totalDias
      } = currentOption.periods[index + newPeriods.length - totalPeriodsToUpdate]

      const DataInicio = index === 0 ? 
        newPeriods[newPeriods.length - totalPeriodsToUpdate - 1].DataFim :
        accumulator[index - 1].DataFim

      const DataFim = new Date(DataInicio.getTime())
      DataFim.setDate(DataFim.getDate() + totalDias)

      const newPeriod = {
        DataInicio,
        DataFim
      }

      return [...accumulator, newPeriod]
    }, [])

    const updatedPeriodsToSet = [...newPeriods.slice(0, index + 1), ...updatedPeriods]

    setPeriodos(updatedPeriodsToSet)
  }

  const onChangeDecimoTerceiro = (index: number, value: boolean): void => {
    const newPeriods = [...formData.periods]
    newPeriods.forEach((period) => { period.DecimoTerceiro = false })
    newPeriods[index].DecimoTerceiro = value

    _onChange({
      formField: 'periods',
      value: newPeriods
    })
  }

  let formElement: JSX.Element
  
  if(Status === 'Draft' || Status === 'Rejected by manager' || Status === 'Rejected by HR') {
    formElement = <CreateForm 
      observacoes={formData.Observacao}
      observacoesGestor={formData.ObservacaoGestor}
      observacoesRH={formData.ObservacaoRH}
      selectedKey={QuantidadeDiasOptions.findIndex((option) => option.text === formData.QtdDias)}
      status={formData.Status}
      onChangeHandler={_onChange}
      onChangeQuantidadeDias={onChangeQtdDias}/>
  }

  else {
    formElement = 
      <ViewForm 
        observacoes={formData.Observacao}
        observacoesGestor={formData.ObservacaoGestor}
        observacoesRH={formData.ObservacaoRH}
        status={formData.Status}
        onChangeObservacoesGestor={onChangeObservacaoGestor}
        onChangeObservacaoRH={onChangeObservacaoRH}
        isUserManager={isUserManager}
        isMemberOfHR={isMemberOfHR}
        selectedKey={QuantidadeDiasOptions.findIndex((option) => option.text === formData.QtdDias)}
        onChangeQuantidadeDias={onChangeQtdDias}/>
  }

  return (
    <Stack
      horizontalAlign='center'>
      <Stack
      tokens={containerStackTokens}
      styles={containerStackStyles}>

        <Stack
        tokens={spacingStackTokens}
        styles={containerStackStyles}>
          {formElement}
        </Stack>

        <Stack>
          <PeriodosFeriasList 
            periods={periodos}
            disableDataInicio={!enableDataInicio} 
            disableDecimoTerceiro={!enableDecimoTerceiro}
            minDate={minDate}
            onChangeDataInicio={onChangeDataInicio}
            onChangeDecimoTerceiro={onChangeDecimoTerceiro}/>
        </Stack>

        <Stack 
        tokens={spacingStackTokens}
        style={{
          display: 'none'
        }} />

        <Stack>
          <Label style={{
            color: 'red'
          }}>
            {errorList.length ? errorList[0] : ''}
          </Label>
        </Stack>

        <Stack
          horizontal
          tokens={spacingStackTokens}>
            <FormButtons 
            onSend={_onSend}
              onClose={onClose}
              onApproveManager={onApproveManager}
              onRejectManager={onRejectManager}
              onApproveHR={onApproveHR}
              onRejectHR={onRejectHR}
              onSaveHR={onSaveHR}
              displayMode={displayMode}
              isUserManager={isUserManager}
              isMemberOfHR={isMemberOfHR}
              isAuthor={isAuthor}
              status={formData.Status}
            />
        </Stack>

        <hr />

        <Stack>
          <SolicitacoesList items={userItems || []} />
        </Stack>
      </Stack>
    </Stack>
  );
}