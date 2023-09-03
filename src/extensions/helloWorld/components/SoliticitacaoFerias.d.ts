import { StatusSolicitacaoFerias } from "../../../enums/StatusSolicitacaoFerias";
import { PeriodItem } from "./PeriodosFeriasList/PeriodosFeriasList.props";

export default interface IListSolicitacaoFeriasItem {
    Abono: boolean;
    DecimoTerceioSalario: boolean;
    Status: StatusSolicitacaoFerias;
    GestorId: number;
    Observacao: string;
    QtdDias: string;
    AuthorId: number;
    ObservacaoGestor: string;
    periods: PeriodItem[]
}