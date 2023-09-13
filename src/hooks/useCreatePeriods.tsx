import * as React from 'react';
import { PeriodItem } from '../extensions/helloWorld/components/PeriodosFeriasList/PeriodosFeriasList.props';
import { QuantidadeDiasOption } from '../enums/QuantidadeDiasOption';

export function useCreatePeriods (quantidadeDias: QuantidadeDiasOption, minDate: Date) {
  const createPeriods = React.useCallback((quantidadeDias: QuantidadeDiasOption, minDate: Date) => {
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

  return createPeriods(quantidadeDias, minDate)
}