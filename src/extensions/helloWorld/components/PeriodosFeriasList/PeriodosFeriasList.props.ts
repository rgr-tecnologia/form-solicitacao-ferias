export interface PeriodosFeriasListProps {
    periods: PeriodItem[]
}

export interface PeriodItem {
    dataInicio: Date
    dataFim: Date
    status: PeriodItemStatusOptions
}

export type PeriodItemStatusOptions = 'In review' | 'Approved' | 'Rejected'