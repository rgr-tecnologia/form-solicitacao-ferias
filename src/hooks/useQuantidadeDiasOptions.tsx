import React from 'react';
import { QuantidadeDiasOption } from "../enums/QuantidadeDiasOption";


export function useQuantidadeDiasOptions(): QuantidadeDiasOption[] {
    const useQuantidadeDiasOptions: QuantidadeDiasOption[] = React.useMemo(() => {
      return [
        {
          text: '30 dias de descanso',
          totalDiasAbono: 0,
          totalPeriods: 1,
          options: [
            {
              totalDias: 30
            }
          ]
        },
        {
          text:  '20 dias de descanso + 10 dias de descanso',
          totalDiasAbono: 0,
          totalPeriods: 2,
          options: [
            {
              totalDias: 20
            },
            {
              totalDias: 10
            }
          ]
        },
        {
          text: '20 dias de descanso + 10 dias de abono',
          totalDiasAbono: 10,
          totalPeriods: 1,
          options: [
            {
              totalDias: 20
            }
          ]
        },
        {
          text: '15 dias de descanso + 10 dias de abono + 5 dias de descanso',
          totalDiasAbono: 10,
          totalPeriods: 2,
          options: [
            {
              totalDias: 15
            },
            {
              totalDias: 5
            }
          ]
        },
        {
          text:  '15 dias de descanso + 15 dias de descanso',
          totalDiasAbono: 0,
          totalPeriods: 2,
          options: [
            {
              totalDias: 15
            },
          ]
        },
        {
          text:  '20 dias de descanso + 5 dias de descanso + 5 dias de descanso',
          totalDiasAbono: 0,
          totalPeriods: 3,
          options: [
            {
              totalDias: 20
            },
            {
              totalDias: 5
            }
          ]
        },
        {
          text: '15 dias de descanso + 10 dias de descanso + 5 de descanso',
          totalDiasAbono: 0,
          totalPeriods: 3,
          options: [
            {
              totalDias: 15
            },
            {
              totalDias: 10
            },
            {
              totalDias: 5
            },
          ]
        }
      ];
    }, [])


    return useQuantidadeDiasOptions
}