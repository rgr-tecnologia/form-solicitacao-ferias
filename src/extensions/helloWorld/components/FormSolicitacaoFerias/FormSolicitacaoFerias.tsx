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

  /*const _validateForm= (): string[] => {
    const todayDate = new Date();
    const {
      DataInicio,
      DataFim
    } = formData

    const errorList= []

    if(DataInicio >= DataFim) {
      errorList.push('O valor do campo "Data de início" deve ser menor ao valor do campo "Data de fim"')
    }
     
    else if (DataInicio < todayDate) {
      errorList.push('O valor do campo "Data de início" deve ser maior ou igual à data de hoje')
    }
 
    else if (DataFim <= todayDate) {
      errorList.push('O valor do campo "Data de fim" deve ser maior à data de hoje')
    }
    
    return errorList
  }*/

  const _onSave= (): void => {
    //const errorList = _validateForm()
    const isFormValid = errorList.length > 0 ? false : true

    if(!isFormValid) {
      setErrorlist(errorList)
      return console.error(errorList[0]);      
    }

    onSave(formData)    
  }

  const _onApprove= (): void => {
    formData.Status= 'Approved'
  
    onSave(formData)
  }

  const _onReject= (): void => {
    formData.Status= 'Rejected'
    
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
        isUserManager={isUserManager}/>
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
              onSave={_onSave}
              onApprove={_onApprove}
              onReject={_onReject}
              displayMode={displayMode}
              isUserManager={isUserManager}
              status={formData.Status}
              isUserRH={false}
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