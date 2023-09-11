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
    context,
  } = props

  const {
    Status
  } = item

  const [formData, setFormData] = React.useState<IListSolicitacaoFeriasItem>({...item})
  const [errorList, setErrorlist] = React.useState<string[]>([])
  
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

  let formElement: JSX.Element
  
  if(Status === 'Draft' || Status === 'Rejected by manager' || Status === 'Rejected by HR') {
    formElement = <CreateForm 
      context={context}
      item={formData}
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
              onClose={onClose}
              onSave={_onSend}
              onApproveManager={onApproveManager}
              onRejectManager={onRejectManager}
              onApproveHR={onApproveHR}
              onRejectHR={onRejectHR}
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