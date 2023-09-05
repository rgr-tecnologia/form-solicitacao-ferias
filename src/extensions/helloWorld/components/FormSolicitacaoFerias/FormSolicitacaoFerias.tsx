import * as React from 'react';
import { FormDisplayMode } from '@microsoft/sp-core-library';

//UI components
import { Stack, IStackTokens, IStackStyles } from '@fluentui/react/lib/Stack';
import SolicitacoesList from '../SolicitacoesList/SolicitacoesList';

//Forms components
import CreateForm from '../CreateForm/CreateForm'
import ViewForm from '../ViewForm/ViewForm'

//Types
import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';
import { Label } from 'office-ui-fabric-react';
import { IFormSolicitacaoFeriasProps } from './FormSolicitacaoFerias.props';
import { FormButtons } from '../FormButtons/FormButtons';

export interface IFormOnChangeHandlerProps {
  formField: string;
  value: IListSolicitacaoFeriasItem[keyof IListSolicitacaoFeriasItem];
}

export default function FormSolicitacaoFerias(props: IFormSolicitacaoFeriasProps)
: React.ReactElement<IFormSolicitacaoFeriasProps> {
  const {
    displayMode,
    onSave,
    onClose,
    isUserManager,
    isMemberOfHR,
    userItems,
    item,
    context,
  } = props

  const [formData, setFormData] = React.useState({...item})
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

  const _onSend= (): void => {
    //const errorList = _validateForm()
    const isFormValid = errorList.length > 0 ? false : true

    if(!isFormValid) {
      setErrorlist(errorList)
      throw Error(errorList[0]);      
    }

    onSave({
      ...formData,
      Status: 'In review'
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

  const _onChange= ({formField, value}: IFormOnChangeHandlerProps): void => {
    const _formData ={...formData} 
    if (formField === 'QtdDias' && (value !== '10 x 14 x 6' && value !== '20 x 10')){
      _formData.Abono = false
    }
    setFormData({..._formData, [formField]: value })
  }  

  const _onChangeObservacaoGestor= (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, value?: string)
  : void => _onChange({
    formField: 'ObservacaoGestor',
    value: value
  }) 

  let formElement: JSX.Element
  
  if(displayMode === FormDisplayMode.Display || displayMode === FormDisplayMode.Edit) {
    formElement = 
      <ViewForm 
        item={formData} 
        onChangeObservacoesGestor={() => {_onChangeObservacaoGestor()}}
        isUserManager={isUserManager}
        isMemberOfHR={isMemberOfHR}/>
  }

  else {
    formElement = <CreateForm 
      context={context}
      item={formData}
      onChangeHandler={_onChange}/>
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