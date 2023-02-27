export default interface IListSolicitacaoFeriasItem {
    Abono: boolean;
    DecimoTerceioSalario: boolean;
    DataInicio: Date;
    DataFim: Date;
    Status: string;
    GestorId: number;
    Observacao: string;
    QtdDias: string;
    AuthorId: number;
    ObservacaoGestor: string;
}