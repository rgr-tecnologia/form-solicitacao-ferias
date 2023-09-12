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
    onChangeObservacoesGestor,
    onChangeObservacaoRH
  } = props

  const containerStackTokens: IStackTokens = { childrenGap: 5 };

  const spacingStackTokens: IStackTokens = {
    childrenGap: '1.5rem',
  };

  let observacoes: JSX.Element

  if(isUserManager && item.Status === 'In review by manager') {
    observacoes= (
      <>
        <TextField label="Observações gestor" 
          value={item.ObservacaoGestor} 
          onChange={onChangeObservacoesGestor}
          multiline rows={3}/>
      </>
    )
  }

  else if(isMemberOfHR && item.Status === "In review by HR") {
    observacoes = ( 
        <>
          <>
            <TextField label="Observações gestor" 
              value={item.ObservacaoGestor} 
              onChange={onChangeObservacoesGestor}
              disabled={true}
              multiline rows={3}/>
          </>
          <TextField label="Observações RH" 
            value={item.ObservacaoRH} 
            onChange={onChangeObservacaoRH}
            multiline rows={3}/>
        </>
      )    
  }

  return (
    <Stack tokens={containerStackTokens}>
      <Stack>
        <Text variant='xLarge' styles={{root: {color: 'rgb(0, 120, 212)'}}}>Soliticação a ser avalidada</Text>
      </Stack>

      <Stack>
        <Label>Opções de férias</Label>
        <TextField disabled defaultValue={item.QtdDias} />
      </Stack>

      <Stack>
        <TextField label="Observações" 
              value={item.Observacao} 
              onChange={onChangeObservacaoRH}
              disabled={true}
              multiline 
              rows={3}/>
      </Stack>

      <Stack 
        tokens={spacingStackTokens}>
          {observacoes}
      </Stack>
    </Stack>
  );
}