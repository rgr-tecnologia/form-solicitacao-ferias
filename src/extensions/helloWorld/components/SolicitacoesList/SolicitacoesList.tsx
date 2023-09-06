import * as React from 'react';
import { DetailsList, IColumn, SelectionMode } from '@fluentui/react/lib/DetailsList';
import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';
import { Text } from 'office-ui-fabric-react';

export interface ISolititacoesListProps {
  items: IListSolicitacaoFeriasItem[];
}

export default function SolicitacoesList(props: ISolititacoesListProps): React.ReactElement<ISolititacoesListProps> {
    const {
        items
    }= props

    const columns: IColumn[] = [
        {
            key: 'column6',
            name: 'Ano de referência',
            fieldName: 'Created',
            minWidth: 100,
            onRender: (item: IListSolicitacaoFeriasItem) => {
                return <Text>{new Date(item.Created).getFullYear()}</Text>
            }
        },
        {
            key: 'column6',
            name: 'QtdDias',
            fieldName: 'QtdDias',
            minWidth: 100,
        },
        {
            key: 'column8',
            name: 'Status',
            fieldName: 'Status',
            minWidth: 100,
        },
    ];

    return (
        <>
            <Text
            variant='xLarge'
            color='rgb(0, 120, 212)'
            styles={{
                root: {
                    color: 'rgb(0, 120, 212)',
                }
            }}>
                Histórico de solicitações do colaborador
            </Text>
            <DetailsList 
            selectionMode={SelectionMode.none}
            items={items.slice(0, 5)}
            columns={columns}/>
        </>

    )
}