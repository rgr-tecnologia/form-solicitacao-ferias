import React from 'react';
import { QuantidadeDiasOptions } from "../enums/QuantidadeDiasOptions";


export function useQuantidadeDiasOptions(): QuantidadeDiasOptions[] {
    const useQuantidadeDiasOptions: QuantidadeDiasOptions[] = React.useMemo(() => {
      return [
        {
          text: '30',
          totalDiasAbono: 0,
          periods: [{
            totalDias: 30
          }]        
        },
        {
          text: '20 + 10',
          totalDiasAbono: 0,
          periods: [
          {
            totalDias: 20
          },
          {
            totalDias: 10
          }]
        },
        {
          text: '20 + 10 (abono)',
          totalDiasAbono: 10,
          periods: [{
            totalDias: 20
          }]
        },
        {
          text: '15 + 5 + 10 (abono)',
          totalDiasAbono: 10,
          periods: [
            {
              totalDias: 15
            },
            {
              totalDias: 5
            }
          ]
        },
        {
          text:  '15 + 15',
          totalDiasAbono: 0,
          periods: [
            {
              totalDias: 15
            },
            {
              totalDias: 15
            }
          ]
        },
        {
          text:  '20 + 5 + 5',
          totalDiasAbono: 0,
          periods: [
            {
              totalDias: 20
            },
            {
              totalDias: 5
            },
            {
              totalDias: 5
            }
          ]
        },
      ];
    }, [])


    return useQuantidadeDiasOptions
}