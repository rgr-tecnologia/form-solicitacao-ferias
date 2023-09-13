import { StatusSolicitacaoFerias } from "../../../../enums/StatusSolicitacaoFerias";
export interface IViewFormSolicitacaoFeriasProps {
    isUserManager: boolean;
    isMemberOfHR: boolean;
    observacoes: string;
    observacoesGestor: string;
    observacoesRH: string;
    status: StatusSolicitacaoFerias;
    selectedKey: number;
    onChangeObservacoesGestor: () => void;
    onChangeObservacaoRH: () => void;
    onChangeQuantidadeDias: (props: string) => void;
}