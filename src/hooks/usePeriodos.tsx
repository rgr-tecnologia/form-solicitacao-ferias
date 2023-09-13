import * as React from 'react';
import { PeriodItem } from '../extensions/helloWorld/components/PeriodosFeriasList/PeriodosFeriasList.props';
import { QuantidadeDiasOption } from '../enums/QuantidadeDiasOption';

export function usePeriodos(initialState: PeriodItem[], quantidadeDias: QuantidadeDiasOption, minDate: Date):
    [PeriodItem[], React.Dispatch<React.SetStateAction<PeriodItem[]>>] {
    const [periodos, setPeriodos] = React.useState<PeriodItem[]>([...initialState])

    const createPeriodos = React.useCallback((quantidadeDias: QuantidadeDiasOption) => {
        const { periods } = quantidadeDias
        const totalPeriods = periods.length;

        const basePeriods = [...new Array(totalPeriods)]
    
        const newPeriods: PeriodItem[] = basePeriods.reduce((accumulator: PeriodItem[], _, index) => {
          const periodoAtual = periods[index]
          const periodoAnterior = accumulator[index-1]
    
          const DataInicio = index === 0 ? minDate : periodoAnterior.DataFim
          const DataFim = new Date(DataInicio.getTime())
          DataFim.setDate(DataFim.getDate() + periodoAtual.totalDias)
    
          accumulator.push({
            DataInicio,
            DataFim,
            DecimoTerceiro: false
          })
    
          return accumulator
        }, [])

        return newPeriods
    }, []) 

    React.useEffect(() => {
        if(periodos) return
        const newPeriods = createPeriodos(quantidadeDias)
        setPeriodos([...newPeriods])        
    }, [])

    React.useEffect(() => {
        const newPeriods = createPeriodos(quantidadeDias)
        setPeriodos([...newPeriods])
    }, [quantidadeDias])

    return [
        periodos,
        setPeriodos
    ]
}