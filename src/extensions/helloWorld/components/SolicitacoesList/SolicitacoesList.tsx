import * as React from 'react';
import { DetailsList, IColumn, SelectionMode } from '@fluentui/react/lib/DetailsList';
import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';
import { Link, Text } from 'office-ui-fabric-react';

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
                return (
                    <Link
                        href={`/sites/newportal/_layouts/15/SPListForm.aspx?PageType=4&List=01c2737e-aec9-47d1-ad24-3569b2bc534b&ID=${item.Id}`}
                        target='_blank'>
                        {new Date(item.Created).getFullYear()}
                    </Link>
                )
            }
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