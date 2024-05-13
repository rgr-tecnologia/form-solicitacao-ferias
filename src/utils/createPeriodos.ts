import { QuantidadeDiasOption } from "../enums/QuantidadeDiasOption";
import { Periodo } from "../types/Periodo";

export function createPeriodos(
  quantidadeDias: QuantidadeDiasOption,
  minDate: Date
): Periodo[] {
  const { totalPeriods } = quantidadeDias;
  const DataInicio = minDate;
  const DataFim = minDate;

  const newPeriods: Periodo[] = [...new Array(totalPeriods)]
    .fill({})
    .map(() => ({
      DataInicio,
      DataFim,
      DecimoTerceiro: false,
      QuantidadeDias: null,
    }));

  return newPeriods;
}
