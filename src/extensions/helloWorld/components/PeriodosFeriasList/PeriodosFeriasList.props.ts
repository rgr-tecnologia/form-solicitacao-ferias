export interface PeriodosFeriasListProps {
    periods: PeriodItem[];
    onChangeDataInicio: (index: number, newDate: Date) => void;
}

export interface PeriodItem {
    dataInicio: Date
    dataFim: Date
}

export type PeriodItemStatusOptions = 'In review' | 'Approved' | 'Rejected'