export interface PeriodosFeriasListProps {
    periods: PeriodItem[];
    disableDataInicio: boolean;
    disableDecimoTerceiro: boolean;
    onChangeDataInicio?: (index: number, newDate: Date) => void;
    onChangeDecimoTerceiro?: (index: number, newValue: boolean) => void;
}

export interface PeriodItem {
    Id?: number
    DataInicio: Date
    DataFim: Date
    SolicitacaoFeriasId?: number
    DecimoTerceiro: boolean
}

export type PeriodItemStatusOptions = 'In review' | 'Approved' | 'Rejected'