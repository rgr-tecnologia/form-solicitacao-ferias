import * as React from 'react';

import { Text } from '@fluentui/react/lib/Text';
import { Label, Stack, IStackTokens, TextField } from 'office-ui-fabric-react';
import { IViewFormSolicitacaoFeriasProps } from './ViewForm.props';

export default function ViewForm(props: IViewFormSolicitacaoFeriasProps)
: React.ReactElement<IViewFormSolicitacaoFeriasProps> {
  const { 
    isUserManager,
    isMemberOfHR,
    onChangeObservacoesGestor,
    onChangeObservacaoRH,
    observacoes,
    observacoesGestor,
    observacoesRH,
    quantidadeDias,
    status,
  } = props

  const containerStackTokens: IStackTokens = { childrenGap: 5 };

  const spacingStackTokens: IStackTokens = {
    childrenGap: '1.5rem',
  };

  let observacoesElement: JSX.Element

  if(isUserManager && status === 'In review by manager') {
    observacoesElement = (
      <>
        <TextField label="Observações gestor" 
          value={observacoesGestor} 
          onChange={onChangeObservacoesGestor}
          multiline rows={3}/>
      </>
    )
  }

  else if(isMemberOfHR && status === "In review by HR") {
    observacoesElement = ( 
        <>
          <>
            <TextField label="Observações gestor" 
              value={observacoesGestor} 
              onChange={onChangeObservacoesGestor}
              disabled={true}
              multiline rows={3}/>
          </>
          <TextField label="Observações RH" 
            value={observacoesRH}
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
        <TextField disabled defaultValue={quantidadeDias} />
      </Stack>

      <Stack>
        <TextField label="Observações" 
              value={observacoes} 
              onChange={onChangeObservacaoRH}
              disabled={true}
              multiline 
              rows={3}/>
      </Stack>

      <Stack 
        tokens={spacingStackTokens}>
          {observacoesElement}
      </Stack>
    </Stack>
  );
}