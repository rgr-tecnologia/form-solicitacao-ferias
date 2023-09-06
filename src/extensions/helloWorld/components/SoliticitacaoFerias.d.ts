import { StatusSolicitacaoFerias } from "../../../enums/StatusSolicitacaoFerias";
import { PeriodItem } from "./PeriodosFeriasList/PeriodosFeriasList.props";

export default interface IListSolicitacaoFeriasItem {
    AbonoQuantidadeDias: number;
    Status: StatusSolicitacaoFerias;
    GestorId: number;
    Observacao: string;
    QtdDias: string;
    AuthorId: number;
    Created: string;
    ObservacaoGestor: string;
    ObservacaoRH: string;
    periods: PeriodItem[]
}