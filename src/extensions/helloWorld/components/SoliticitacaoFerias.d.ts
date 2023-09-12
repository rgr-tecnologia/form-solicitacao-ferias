import { QuantidadeDiasOptionText } from "../../../enums/QuantidadeDiasOption";
import { StatusSolicitacaoFerias } from "../../../enums/StatusSolicitacaoFerias";
import { PeriodItem } from "./PeriodosFeriasList/PeriodosFeriasList.props";

export default interface IListSolicitacaoFeriasItem {
    Id?: number;
    AbonoQuantidadeDias: number;
    AuthorId: number;
    Created: string;
    GestorId: number;
    Observacao: string;
    ObservacaoGestor: string;
    ObservacaoRH: string;
    QtdDias: QuantidadeDiasOptionText;
    Status: StatusSolicitacaoFerias;
    periods: PeriodItem[]
}