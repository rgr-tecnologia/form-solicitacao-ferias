import { DayOfWeek } from "office-ui-fabric-react";
import { CreateSolicitacaoFerias } from "../types/SolicitacaoFerias";
import { Periodo } from "../types/Periodo";
import { ColaboradorProfile } from "../types/ColaboradorProfile";

export function isDayOfWeek(periodo: Periodo): boolean {
  return (
    periodo.DataInicio.getDay() === DayOfWeek.Friday ||
    periodo.DataInicio.getDay() === DayOfWeek.Saturday ||
    periodo.DataInicio.getDay() === DayOfWeek.Sunday
  );
}

export function isHigherThanMaxDate(periodo: Periodo, maxDate: Date): boolean {
  return periodo.DataFim > maxDate;
}

export function validateForm(
  formData: CreateSolicitacaoFerias,
  periodos: Periodo[],
  colaborador: ColaboradorProfile
): Error[] {
  const errors: Error[] = [];

  if (!formData.Observacao) {
    errors.push(new Error('O campo "Observações" é obrigatório.'));
  }

  if (
    !formData.ObservacaoGestor &&
    formData.Status === "In review by manager"
  ) {
    errors.push(new Error('O campo "Observações gestor" é obrigatório.'));
  }

  if (!formData.ObservacaoRH && formData.Status === "In review by HR") {
    errors.push(new Error('O campo "Observações RH" é obrigatório.'));
  }

  const isValid = !periodos.reduce((accumulator, periodo) => {
    return accumulator && isDayOfWeek(periodo);
  }, true);

  if (!isValid) {
    errors.push(
      new Error(
        "Não é permitido agendar férias com início às sextas-feiras, sábados ou domingos."
      )
    );
  }

  const maximoQuantidadeDias = 30 - formData.AbonoQuantidadeDias;
  if (!somaDosPeriodosIgualMaximoDias(periodos, maximoQuantidadeDias)) {
    errors.push(
      new Error(
        `A soma dos períodos deve ser igual a ${maximoQuantidadeDias} dias.`
      )
    );
  }

  if (
    formData.Status === "Approved by HR" ||
    formData.Status === "Edited by HR"
  ) {
    const maxDate = new Date(
      new Date(formData.ColaboradorId).setDate(
        new Date().getDate() + 365 * 2 - 61
      )
    );
    const hasDataInicioGreaterThanMaxDate = periodos.reduce(
      (accumulator, currentValue) => {
        return accumulator && isHigherThanMaxDate(currentValue, maxDate);
      },
      true
    );

    if (hasDataInicioGreaterThanMaxDate) {
      errors.push(
        new Error(
          "A data de início do período não pode ser superior a 2 anos a partir da data atual."
        )
      );
    }
  }

  return errors;
}

export function somaDosPeriodosIgualMaximoDias(
  periodos: Periodo[],
  maximoQuantidadeDias = 30
): boolean {
  const quantidadeDias = periodos.reduce((accumulator, period) => {
    return accumulator + period.QuantidadeDias;
  }, 0);

  return quantidadeDias === maximoQuantidadeDias;
}
