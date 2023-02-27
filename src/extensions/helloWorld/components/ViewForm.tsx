import * as React from 'react';

import { Text } from '@fluentui/react/lib/Text';
import { Label, Stack, IStackTokens, TextField } from 'office-ui-fabric-react';

import IListSolicitacaoFeriasItem from './SoliticitacaoFerias';

export interface IViewFormSolicitacaoFeriasProps {
  item: IListSolicitacaoFeriasItem;
}

export default function FormSolicitacaoFerias(props: IViewFormSolicitacaoFeriasProps)
: React.ReactElement<IViewFormSolicitacaoFeriasProps> {

  const { item } = props

  const containerStackTokens: IStackTokens = { childrenGap: 5 };

  const spacingStackTokens: IStackTokens = {
    childrenGap: '1.5rem',
  };

  return (
    <Stack tokens={containerStackTokens}>
      <Stack>
        <Text variant='xLarge' styles={{root: {color: 'rgb(0, 120, 212)'}}}>Soliticação a ser avalidada</Text>
      </Stack>

      <Stack 
      horizontal
      tokens={spacingStackTokens}>
        <Stack>
          <Label> Data de Início </Label>
          <TextField disabled defaultValue={item.DataInicio.toLocaleDateString()} />
        </Stack>
        <Stack>
          <Label> Data de Fim </Label>
          <TextField disabled defaultValue={item.DataFim.toLocaleDateString()} />
        </Stack>
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

      <Stack>
        <Label>Observações</Label>          
        <TextField 
          disabled
          multiline
          defaultValue={item.Observacao? item.Observacao : ''} />
      </Stack>
    </Stack>
  );
}