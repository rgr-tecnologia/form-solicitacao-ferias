import * as React from 'react';
import { DetailsList, IColumn, SelectionMode } from '@fluentui/react/lib/DetailsList';
import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';
import { Text } from 'office-ui-fabric-react';

export interface ISolititacoesListProps {
  items: IListSolicitacaoFeriasItem[];
}

type IListItemOmitUnion = "Abono" | "DecimoTerceioSalario" | "DataInicio" | "DataFim"
type IListItemBase = Omit<IListSolicitacaoFeriasItem, "GestorId" | "AuthorId" | "Observacao">

export interface IListItem extends Omit<IListItemBase, IListItemOmitUnion> {
    Abono: string;
    DecimoTerceioSalario: string;
}

export default function SolicitacoesList(props: ISolititacoesListProps): React.ReactElement<ISolititacoesListProps> {
    const {
        items
    }= props

    const listItems: IListItem[] = items.map((item, index) => ({
        ...item,
        Abono: item.Abono? "Sim" : "Não",
        DecimoTerceioSalario: item.DecimoTerceioSalario? "Sim" : "Não"
    }))

    const columns: IColumn[] = [
        {
            key: 'column5',
            name: 'Abono',
            fieldName: 'Abono',
            minWidth: 100,
        },
        {
            key: 'column5',
            name: '13° salário',
            fieldName: 'DecimoTerceioSalario',
            minWidth: 100,
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
            items={listItems.slice(0, 5)}
            columns={columns}/>
        </>

    )
}