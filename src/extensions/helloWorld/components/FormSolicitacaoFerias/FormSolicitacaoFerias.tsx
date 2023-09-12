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
import { PeriodItem } from '../PeriodosFeriasList/PeriodosFeriasList.props';
import { PeriodosFeriasList } from '../PeriodosFeriasList/PeriodosFeriasList';

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
    Status
  } = item

  const [formData, setFormData] = React.useState<IListSolicitacaoFeriasItem>({...item})
  const [errorList, setErrorlist] = React.useState<string[]>([])

  const QuantidadeDiasOptions = useQuantidadeDiasOptions()

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

  const validateForm = React.useCallback(() => {
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

  const _onSend= (): void => {
    const errorList = validateForm()
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
    formData.Status= 'Approved by manager'
  
    onSave(formData)
  }

  const onRejectManager= (): void => {
    formData.Status= 'Rejected by manager'
    
    onSave(formData)
  }

  const onApproveHR= (): void => {
    formData.Status= 'Approved by HR'
  
    onSave(formData)
  }

  const onRejectHR= (): void => {
    formData.Status= 'Rejected by HR'
  
    onSave(formData)
  }

  const onSaveHR= (): void => {
    const errorList = validateForm()
    const isFormValid = errorList.length > 0 ? false : true

    if(!isFormValid) {
      setErrorlist(errorList)
      throw Error(errorList[0]);      
    }

    onSave(formData)
  }

  const _onChange= ({formField, value} : any): void => {
    const newFormData= {...formData} as any
    newFormData[formField] = value    

    setFormData({...newFormData})
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

    _onChange({
      formField: 'periods',
      value: updatedPeriodsToSet
    })
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

  React.useEffect(() => {
    const { periods, totalDiasAbono } = QuantidadeDiasOptions.find((option) => {
      return option.text === formData.QtdDias
    })
    
    const totalPeriods = periods.length;

    const newPeriods = [...new Array(totalPeriods)]

    const dataToSet: PeriodItem[] = newPeriods.reduce((accumulator: PeriodItem[], _, index) => {
      const periodoAtual = periods[index]
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

    _onChange({
      formField: 'AbonoQuantidadeDias',
      value: totalDiasAbono
    })

    _onChange({
      formField: 'periods',
      value: dataToSet
    })    
  }, [formData.QtdDias])

  let formElement: JSX.Element
  
  if(Status === 'Draft' || Status === 'Rejected by manager' || Status === 'Rejected by HR') {
    formElement = <CreateForm 
      observacoes={formData.Observacao}
      observacoesGestor={formData.ObservacaoGestor}
      observacoesRH={formData.ObservacaoRH}
      selectedKey={QuantidadeDiasOptions.findIndex((option) => option.text === formData.QtdDias)}
      status={formData.Status}
      onChangeHandler={_onChange}/>
  }

  else {
    formElement = 
      <ViewForm 
        item={formData} 
        onChangeObservacoesGestor={onChangeObservacaoGestor}
        onChangeObservacaoRH={onChangeObservacaoRH}
        isUserManager={isUserManager}
        isMemberOfHR={isMemberOfHR}/>
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
            disableDataInicio={false} 
            disableDecimoTerceiro={formData.Status === 'Approved by HR' && isMemberOfHR}
            periods={formData.periods} 
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