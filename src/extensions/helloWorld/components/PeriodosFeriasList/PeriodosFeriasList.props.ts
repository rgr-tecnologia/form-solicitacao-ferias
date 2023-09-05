export interface PeriodosFeriasListProps {
    periods: PeriodItem[];
    onChangeDataInicio: (index: number, newDate: Date) => void;
}

export interface PeriodItem {
    Id?: number
    DataInicio: Date
    DataFim: Date
    SolicitacaoFeriasId?: number
}

export type PeriodItemStatusOptions = 'In review' | 'Approved' | 'Rejected'