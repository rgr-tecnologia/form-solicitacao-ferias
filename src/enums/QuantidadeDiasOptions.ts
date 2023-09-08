export interface QuantidadeDiasOptions {
    periods: Period[]
    text: QuantidadeDiasOptionsText,
    totalDiasAbono: number,
}

interface Period {
    totalDias: number,    
}

type QuantidadeDiasOptionsText = 
    '30 dias de descanso' |
    '20 dias de descanso + 10 dias de descanso' |
    '20 dias de descanso + 10 dias de abono' |
    '15 dias de descanso + 10 dias de abono + 5 dias de descanso' |
    '15 dias de descanso + 15 dias de descanso' |
    '20 dias de descanso + 5 dias de descanso + 5 dias de descanso'