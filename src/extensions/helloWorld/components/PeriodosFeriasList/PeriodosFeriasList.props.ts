export interface PeriodosFeriasListProps {
    periods: PeriodItem[];
    isDisabled: boolean;
    onChangeDataInicio?: (index: number, newDate: Date) => void;
}

export interface PeriodItem {
    Id?: number
    DataInicio: Date
    DataFim: Date
    SolicitacaoFeriasId?: number
}

export type PeriodItemStatusOptions = 'In review' | 'Approved' | 'Rejected'