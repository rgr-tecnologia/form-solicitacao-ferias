export interface QuantidadeDiasOptions {
    periods: Period[]
    text: QuantidadeDiasOptionsText,
    totalDiasAbono: number,
}

interface Period {
    totalDias: number,    
}

type QuantidadeDiasOptionsText = 
    '30'| 
    '20 + 10' | 
    '20 + 10 (abono)' | 
    '15 + 5 + 10 (abono)' | 
    '15 + 15' | 
    '20 + 5 + 5';