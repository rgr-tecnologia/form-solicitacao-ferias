import * as React from 'react';
import { FormDisplayMode } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

//UI components
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack, IStackTokens, IStackStyles } from '@fluentui/react/lib/Stack';
import SolicitacoesList from './SolicitacoesList';
import { TextField } from '@fluentui/react/lib/TextField';

//Forms components
import CreateForm from './CreateForm'
import ViewForm from './ViewForm'

//Types
import IListSolicitacaoFeriasItem from './SoliticitacaoFerias';
import { Label } from 'office-ui-fabric-react';


export interface IFormSolicitacaoFeriasProps {
  context: FormCustomizerContext;
  displayMode: FormDisplayMode;
  etag?: string;
  item: IListSolicitacaoFeriasItem;
  onSave: (item: IListSolicitacaoFeriasItem) => void;
  onClose: () => void;
  userItems?: IListSolicitacaoFeriasItem[];
  isUserManager: boolean;
}

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
    maxWidth: '50%',
    padding: '1rem'
  };

  const spacingStackTokens: IStackTokens = {
    childrenGap: 5,
  };

  const containerStackStyles: IStackStyles = {
    root: {
      minWidth: '100%',
    }
  }

  const _validateForm= (): string[] => {
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
  }

  const _onSave= (): void => {
    const errorList = _validateForm()
    const isFormValid = errorList.length > 0 ? false : true

    if(!isFormValid) {
      setErrorlist(errorList)
      return console.error(errorList[0]);      
    }

    onSave(formData)    
  }

  const _onApprove= (): void => {
    formData.Status= 'Aprovado'
  
    onSave(formData)
  }

  const _onDisapprove= (): void => {
    formData.Status= 'Rejeitado'
    
    onSave(formData)
  }

  const _onChange= ({formField, value}: IFormOnChangeHandlerProps): void => {
    setFormData({...formData, [formField]: value })
  }  

  const _onChangeObservacaoGestor= (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, value?: string)
  : void => _onChange({
    formField: 'ObservacaoGestor',
    value: value
  }) 

  let buttonsElement: JSX.Element
  let formElement: JSX.Element
  let observacaoGestorElement: JSX.Element
  
  if(displayMode === FormDisplayMode.Display || displayMode === FormDisplayMode.Edit) {
    formElement = <ViewForm item={formData} />
  }

  else {
    formElement = <CreateForm 
      context={context}
      item={formData}
      onChangeHandler={_onChange} />
  }

  if(isUserManager && formData.Status === 'Solicitado') {
    buttonsElement = (
      <>
        <PrimaryButton text='Aprovar' onClick={_onApprove}/>
        <DefaultButton text='Reprovar' onClick={_onDisapprove}/>
      </>
    )

    observacaoGestorElement= (
      <>
        <TextField label="Observação gestor" 
          value={formData.ObservacaoGestor} 
          onChange={_onChangeObservacaoGestor}
          multiline rows={3}/>
      </>
    )
  } 
  else if(displayMode === FormDisplayMode.New) {
    buttonsElement = (
      <>
        <PrimaryButton text='Enviar' onClick={_onSave}/>
        <DefaultButton text='Cancelar' onClick={onClose}/>
      </>
    )
  }
  else if(
    (displayMode === FormDisplayMode.Display || displayMode === FormDisplayMode.Edit) &&
    (formData.Status === "Rejeitado" || formData.Status === "Aprovado")) {
      observacaoGestorElement = ( 
        <>
          <Label>Observações gestor</Label>          
          <TextField 
          disabled
          multiline
          defaultValue={item.ObservacaoGestor? item.ObservacaoGestor : ''} />
        </>
      )
            
  }

  return (
    <Stack
      horizontalAlign='center'>
      <Stack
      tokens={containerStackTokens}>

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

        <Stack 
        tokens={spacingStackTokens}>
          {observacaoGestorElement}
        </Stack>

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
          {buttonsElement}
        </Stack>

        <hr />

        <Stack>
          <SolicitacoesList items={userItems || []} />
        </Stack>
      </Stack>
    </Stack>
  );
}