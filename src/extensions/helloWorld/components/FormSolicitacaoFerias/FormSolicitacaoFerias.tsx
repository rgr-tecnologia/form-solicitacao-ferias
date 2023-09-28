import * as React from 'react';

//UI components
import { Stack, IStackTokens, IStackStyles } from '@fluentui/react/lib/Stack';
import SolicitacoesList from '../SolicitacoesList/SolicitacoesList';

//Forms components
import CreateForm from '../CreateForm/CreateForm'
import ViewForm from '../ViewForm/ViewForm'

//Types
import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';
import { DayOfWeek, IDropdownOption, Label } from 'office-ui-fabric-react';
import { IFormSolicitacaoFeriasProps } from './FormSolicitacaoFerias.props';
import { FormButtons } from '../FormButtons/FormButtons';
import { useQuantidadeDiasOptions } from '../../../../hooks/useQuantidadeDiasOptions';
import { PeriodosFeriasList } from '../PeriodosFeriasList/PeriodosFeriasList';
import { QuantidadeDiasOption, QuantidadeDiasOptionText } from '../../../../enums/QuantidadeDiasOption';
import { PeriodItem } from '../PeriodosFeriasList/PeriodosFeriasList.props';
import { useFeriados } from '../../../../hooks/useFeriados';

export interface IFormOnChangeHandlerProps {
  formField: keyof IListSolicitacaoFeriasItem;
  value: any;
}

export default function FormSolicitacaoFerias(props: IFormSolicitacaoFeriasProps)
: React.ReactElement<IFormSolicitacaoFeriasProps> {
  const {
    displayMode,
    onSave: _onSave,
    onClose,
    isUserManager,
    isMemberOfHR,
    isAuthor,
    userItems,
    item,
    periods,
  } = props

  const {
    Status,
  } = item
  
  const [formData, setFormData] = React.useState<IListSolicitacaoFeriasItem>(item)
  const [errorList, setErrorlist] = React.useState<string[]>([])
  const [disabledDates, setDisabledDates] = React.useState<Date[]>([])

  React.useEffect(() => {
    const feriados = useFeriados()

    feriados.then((feriados) => {
      return feriados.map((feriado) => {
        const date = feriado.DiaFeriado
        const month = feriado.MesFeriado - 1

        return Array(3).fill({}).map((_, index) => {
          const year = new Date().getFullYear() + index

          return new Date(year, month, date)
        })
      }).flat()
    })
    .then((feriados) => {
      setDisabledDates(feriados)
    })
  }, [])

  const QuantidadeDiasOptions = useQuantidadeDiasOptions()

  const minDate = React.useMemo(() => {    
    const minDate = 
      formData.Status === 'Approved by HR' || 
      formData.Status === 'Edited by HR' && isMemberOfHR ? 
      new Date() : new Date(new Date().setDate(new Date().getDate() + 45))

    return minDate
  }, [])

  const createPeriods = React.useCallback((quantidadeDias: QuantidadeDiasOption, minDate: Date) => {
    const { totalPeriods } = quantidadeDias
    const DataInicio = minDate
    const DataFim = minDate
  
    const newPeriods: PeriodItem[] = [...new Array(totalPeriods)].fill({}).map(() => ({
      DataInicio,
      DataFim,
      DecimoTerceiro: false,
      QuantidadeDias: null
    }))
  
    return newPeriods
  }, [formData.QtdDias, minDate])

  const [periodos, setPeriodos] = React.useState<PeriodItem[]>(periods.length ? periods : createPeriods(QuantidadeDiasOptions[0], minDate))

  const periodosOptions = React.useMemo(() => {
    const selectedQuantidadeDias =  QuantidadeDiasOptions.find((option) => {
      return option.text === formData.QtdDias
    })

    return selectedQuantidadeDias.options.map((option, index) => {
      return {
        key: index,
        text: option.totalDias.toString()
      }
    })
  }, [formData.QtdDias])
  

  const disableFields = 
    formData.Status === 'Draft' || 
    formData.Status === 'Rejected by HR' || 
    formData.Status === 'Rejected by manager' && isAuthor ||
    formData.Status === 'Approved by HR' || formData.Status === 'Edited by HR' && isMemberOfHR

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

  const validateDataInicio = React.useCallback((periodos: typeof periods) => {
    let errors = []

    errors = periodos.reduce((accumulator, period) => {
      if ((period.DataInicio.getDay() === DayOfWeek.Friday) || 
        (period.DataInicio.getDay() === DayOfWeek.Saturday)  || 
        (period.DataInicio.getDay() === DayOfWeek.Sunday) ){          
          accumulator.push('Não é permitido agendar férias com início às sextas-feiras, sábados ou domingos.')
      } 
      
      return accumulator
    }, [])

    return errors
  }, [periodos])

  const validateObservacao = React.useCallback(() => {
    const errors = []

    if (!formData.Observacao) {
      errors.push('O campo "Observações" é obrigatório.')
    }

    return errors
  }, [formData.Observacao])

  const validateObservacaoGestor = React.useCallback(() => {
    const errors = []

    if (!formData.ObservacaoGestor) {
      errors.push('O campo "Observações gestor" é obrigatório.')
    }

    return errors
  }, [formData.ObservacaoGestor])

  const validateObservacaoRH = React.useCallback(() => {
    const errors = []

    if (!formData.ObservacaoRH) {
      errors.push('O campo "Observações RH" é obrigatório.')
    }

    return errors
  }, [formData.ObservacaoRH])

  const validateQuantidadeDias = React.useCallback(() => {
    const errors = []
    const maximoQuantidadeDias = 30 - formData.AbonoQuantidadeDias

    const quantidadeDias = periodos.reduce((accumulator, period) => {
      return accumulator + period.QuantidadeDias
    }, 0)

    if (quantidadeDias !== maximoQuantidadeDias) {
      errors.push(`A soma dos períodos deve ser igual a ${maximoQuantidadeDias} dias.`)
    }

    return errors
  }, [periodos])

  const onSave = React.useCallback((item: IListSolicitacaoFeriasItem ) => {
    _onSave(item, periodos)
  } , [item, periodos])

  const _onSend= (): void => {
    const errorList = [...validateQuantidadeDias(), ...validateDataInicio(periodos), ...validateObservacao()]
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
    const errorList = [...validateQuantidadeDias(), ...validateDataInicio(periodos)]
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

  const onChangeModalidade = (selectedOptionText: QuantidadeDiasOptionText) => {
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
    const newPeriods = [...periodos]
    const periodsToUpdate = newPeriods.slice(index)
    
    const updatedPeriods = periodsToUpdate.reduce((accumulator, currentValue, index) => {
      const {
        QuantidadeDias,
        DecimoTerceiro
      } = currentValue

      const DataInicio = index === 0 ? 
        value :
        accumulator[index - 1].DataFim

      const DataFim = new Date(DataInicio.getTime())
      DataFim.setDate(DataFim.getDate() + QuantidadeDias)

      const isDecimoTerceiroBetweenPeriod = DataInicio.getMonth() >= 1 && DataInicio.getMonth() <= 9

      const newPeriod = {
        ...currentValue,
        DataInicio,
        DataFim,
        DecimoTerceiro: isDecimoTerceiroBetweenPeriod ? DecimoTerceiro : false
      }

      return [...accumulator, newPeriod]
    }, [])

    const updatedPeriodsToSet = [...newPeriods.slice(0, index), ...updatedPeriods]

    setPeriodos(updatedPeriodsToSet)
  }

  const onChangeDecimoTerceiro = (index: number, value: boolean): void => {
    const newPeriods = [...periodos]
    newPeriods.forEach((period) => { period.DecimoTerceiro = false })
    newPeriods[index].DecimoTerceiro = value

    setPeriodos(newPeriods)
  }

  const onChangeQuantidadeDias = (index: number, option: IDropdownOption): void => {
    const newPeriods = [...periodos]
    newPeriods[index].QuantidadeDias = parseInt(option.text)

    const periodsToUpdate = newPeriods.slice(index)

    const updatedPeriods = periodsToUpdate.reduce((accumulator, currentValue, index) => {
      const {
        QuantidadeDias
      } = currentValue

      const DataInicio = index === 0 ? currentValue.DataInicio : accumulator[index - 1].DataFim
      const DataFim = new Date(DataInicio.getTime())
      DataFim.setDate(DataFim.getDate() + QuantidadeDias)

      const isDecimoTerceiroBetweenPeriod = DataInicio.getMonth() >= 1 && DataInicio.getMonth() <= 9

      const newPeriod = {
        ...currentValue,
        DataInicio,
        DataFim,
        DecimoTerceiro: isDecimoTerceiroBetweenPeriod ? currentValue.DecimoTerceiro : false
      }

      return [...accumulator, newPeriod]
    }, [])

    const updatedPeriodsToSet = [...newPeriods.slice(0, index), ...updatedPeriods]

    setPeriodos(updatedPeriodsToSet)
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
      onChangeQuantidadeDias={onChangeModalidade}/>
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
        onChangeQuantidadeDias={onChangeModalidade}/>
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
            disableFields={!disableFields} 
            minDate={minDate}
            options={periodosOptions}
            onChangeDataInicio={onChangeDataInicio}
            onChangeDecimoTerceiro={onChangeDecimoTerceiro}
            onChangeQuantidadeDias={onChangeQuantidadeDias}
            disabledDates={disabledDates}/>
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