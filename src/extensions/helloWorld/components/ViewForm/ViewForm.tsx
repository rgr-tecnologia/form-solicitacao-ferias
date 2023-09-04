import * as React from 'react';

import { Text } from '@fluentui/react/lib/Text';
import { Label, Stack, IStackTokens, TextField } from 'office-ui-fabric-react';
import { IViewFormSolicitacaoFeriasProps } from './ViewForm.props';

export default function ViewForm(props: IViewFormSolicitacaoFeriasProps)
: React.ReactElement<IViewFormSolicitacaoFeriasProps> {
  const { 
    item,
    isUserManager,
    isMemberOfHR,
    onChangeObservacoesGestor
  } = props

  const containerStackTokens: IStackTokens = { childrenGap: 5 };

  const spacingStackTokens: IStackTokens = {
    childrenGap: '1.5rem',
  };

  let observacaoGestorElement: JSX.Element

  if(isUserManager && item.Status === 'In review') {
    observacaoGestorElement= (
      <>
        <TextField label="Observação gestor" 
          value={item.ObservacaoGestor} 
          onChange={onChangeObservacoesGestor}
          multiline rows={3}/>
      </>
    )
  }

  else if(!isUserManager && !isMemberOfHR) {
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
    <Stack tokens={containerStackTokens}>
      <Stack>
        <Text variant='xLarge' styles={{root: {color: 'rgb(0, 120, 212)'}}}>Soliticação a ser avalidada</Text>
      </Stack>

      <Stack 
      horizontal 
      tokens={spacingStackTokens}>
        <Stack>
          <Label>Qtde. de Dias</Label>
          <TextField disabled defaultValue={item.QtdDias} />
        </Stack>

        <Stack>
          <Label>Abono</Label>
          <TextField disabled defaultValue={item.Abono? "Sim" : "Não"} />
        </Stack>

        <Stack>
          <Label>13° salário</Label>
          <TextField disabled defaultValue={item.DecimoTerceioSalario? "Sim" : "Não"} />
        </Stack>
      </Stack>      

      <Stack 
        tokens={spacingStackTokens}>
          {observacaoGestorElement}
        </Stack>
    </Stack>
  );
}