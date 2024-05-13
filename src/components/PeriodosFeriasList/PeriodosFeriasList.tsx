import * as React from "react";
import {
  Checkbox,
  DatePicker,
  Dropdown,
  IStackTokens,
  Label,
  Stack,
  Text,
  ICalendarProps,
  IDropdownOption,
} from "office-ui-fabric-react";
import { PeriodosFeriasListProps } from "./PeriodosFeriasList.props";

export function PeriodosFeriasList(
  props: PeriodosFeriasListProps
): JSX.Element {
  const {
    periodos,
    disableFields,
    minDate,
    options,
    disabledDates,
    onChangePeriodo,
  } = props;

  const tokens: IStackTokens = {
    childrenGap: 12,
  };

  const style: React.CSSProperties = {
    width: "20%",
  };

  const onChangeDataInicio = (index: number, value: Date): void => {
    const newPeriods = [...periodos];
    const periodsToUpdate = newPeriods.slice(index);

    const updatedPeriods = periodsToUpdate.reduce(
      (accumulator, currentValue, index) => {
        const { QuantidadeDias, DecimoTerceiro } = currentValue;

        const DataInicio = index === 0 ? value : accumulator[index - 1].DataFim;

        const DataFim = new Date(DataInicio.getTime());
        DataFim.setDate(DataFim.getDate() + QuantidadeDias);

        const isDecimoTerceiroBetweenPeriod =
          DataInicio.getMonth() >= 1 && DataInicio.getMonth() <= 9;

        const newPeriod = {
          ...currentValue,
          DataInicio,
          DataFim,
          DecimoTerceiro: isDecimoTerceiroBetweenPeriod
            ? DecimoTerceiro
            : false,
        };

        return [...accumulator, newPeriod];
      },
      []
    );

    const updatedPeriodsToSet = [
      ...newPeriods.slice(0, index),
      ...updatedPeriods,
    ];

    onChangePeriodo(updatedPeriodsToSet);
  };

  const onChangeDecimoTerceiro = (index: number, value: boolean): void => {
    const newPeriods = [...periodos];
    newPeriods.forEach((period) => {
      period.DecimoTerceiro = false;
    });
    newPeriods[index].DecimoTerceiro = value;

    onChangePeriodo(newPeriods);
  };

  const onChangeQuantidadeDias = (
    index: number,
    option: IDropdownOption
  ): void => {
    const newPeriods = [...periodos];
    newPeriods[index].QuantidadeDias = parseInt(option.text);

    const periodsToUpdate = newPeriods.slice(index);

    const updatedPeriods = periodsToUpdate.reduce(
      (accumulator, currentValue, index) => {
        const { QuantidadeDias } = currentValue;

        const DataInicio =
          index === 0
            ? currentValue.DataInicio
            : accumulator[index - 1].DataFim;
        const DataFim = new Date(DataInicio.getTime());
        DataFim.setDate(DataFim.getDate() + QuantidadeDias);

        const isDecimoTerceiroBetweenPeriod =
          DataInicio.getMonth() >= 1 && DataInicio.getMonth() <= 9;

        const newPeriod = {
          ...currentValue,
          DataInicio,
          DataFim,
          DecimoTerceiro: isDecimoTerceiroBetweenPeriod
            ? currentValue.DecimoTerceiro
            : false,
        };

        return [...accumulator, newPeriod];
      },
      []
    );

    const updatedPeriodsToSet = [
      ...newPeriods.slice(0, index),
      ...updatedPeriods,
    ];

    onChangePeriodo(updatedPeriodsToSet);
  };

  const calendar: ICalendarProps = {
    strings: null,
    restrictedDates: disabledDates,
  };

  return (
    <Stack tokens={tokens}>
      <Stack horizontal horizontalAlign="space-around" verticalAlign="center">
        <Stack style={style}>
          <Label>Período</Label>
        </Stack>
        <Stack style={style}>
          <Label>Qtd de dias</Label>
        </Stack>
        <Stack style={style}>
          <Label>Data Início</Label>
        </Stack>
        <Stack style={style}>
          <Label>Data Fim</Label>
        </Stack>
        <Stack style={style}>
          <Label>13° salário?</Label>
        </Stack>
      </Stack>
      {periodos.map((periodo, index) => {
        const { DataInicio, DataFim, QuantidadeDias } = periodo;

        const enableDecimoTerceiro =
          DataInicio.getMonth() >= 1 && DataInicio.getMonth() <= 9;
        const selectedKey =
          options.find((option) => option.text === QuantidadeDias?.toString())
            ?.key ?? null;

        return (
          <>
            <Stack
              key={index}
              horizontal
              horizontalAlign="space-around"
              tokens={tokens}
            >
              <Stack verticalAlign="center" style={style}>
                <Text>{index + 1}° período</Text>
              </Stack>

              <Stack style={style}>
                <Dropdown
                  options={options}
                  selectedKey={selectedKey}
                  onChange={(ev, option) =>
                    onChangeQuantidadeDias(index, option)
                  }
                  disabled={disableFields}
                />
              </Stack>

              <Stack style={style}>
                <DatePicker
                  value={DataInicio}
                  minDate={index === 0 ? minDate : periodos[index - 1].DataFim}
                  onSelectDate={(value: Date) =>
                    onChangeDataInicio(index, value)
                  }
                  formatDate={(date: Date) => date.toLocaleDateString()}
                  disabled={disableFields}
                  calendarProps={calendar}
                />
              </Stack>

              <Stack style={style}>
                <DatePicker
                  value={DataFim}
                  formatDate={(date: Date) => date.toLocaleDateString()}
                  disabled
                />
              </Stack>

              <Stack style={style} verticalAlign="center">
                <Checkbox
                  label="13° salário"
                  checked={periodo.DecimoTerceiro}
                  disabled={disableFields || !enableDecimoTerceiro}
                  onChange={(ev, value: boolean) =>
                    onChangeDecimoTerceiro(index, value)
                  }
                />
              </Stack>
            </Stack>
          </>
        );
      })}
    </Stack>
  );
}
