import * as React from "react";
import {
  DetailsList,
  IColumn,
  SelectionMode,
} from "@fluentui/react/lib/DetailsList";
import { Link, Text } from "office-ui-fabric-react";
import { SolicitacaoFerias } from "../../types/SolicitacaoFerias";

export interface SolititacoesListProps {
  items: SolicitacaoFerias[];
}

export default function SolicitacoesList(
  props: SolititacoesListProps
): React.ReactElement<SolititacoesListProps> {
  const { items } = props;

  const columns: IColumn[] = [
    {
      key: "column6",
      name: "Ano de referência",
      fieldName: "PeriodoAquisitivo",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item: SolicitacaoFerias) => {
        const listId = "3f6aca03-ed95-49d7-91a4-aae35eaa1958";
        return (
          <Link
            href={`/sites/newportal/_layouts/15/SPListForm.aspx?PageType=4&List=${listId}&ID=${item.Id}`}
            target="_blank"
          >
            {new Date(item.PeriodoAquisitivo).getFullYear()}
          </Link>
        );
      },
    },
    {
      key: "column8",
      name: "Status",
      fieldName: "Status",
      minWidth: 100,
    },
  ];

  return (
    <>
      <Text
        variant="xLarge"
        color="rgb(0, 120, 212)"
        styles={{
          root: {
            color: "rgb(0, 120, 212)",
          },
        }}
      >
        Histórico de solicitações do colaborador
      </Text>
      <DetailsList
        selectionMode={SelectionMode.none}
        items={items.slice(0, 5)}
        columns={columns}
      />
    </>
  );
}
