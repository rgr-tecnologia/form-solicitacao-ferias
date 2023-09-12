import { QuantidadeDiasOptionText } from "../../../../enums/QuantidadeDiasOption";
import { StatusSolicitacaoFerias } from "../../../../enums/StatusSolicitacaoFerias";

export interface IViewFormSolicitacaoFeriasProps {
    isUserManager: boolean;
    isMemberOfHR: boolean;
    observacoes: string;
    observacoesGestor: string;
    observacoesRH: string;
    quantidadeDias: QuantidadeDiasOptionText,
    status: StatusSolicitacaoFerias,
    onChangeObservacoesGestor: () => void;
    onChangeObservacaoRH: () => void;
}