import * as React from "react";
import { Checkbox, DatePicker, DayOfWeek, IStackTokens, Stack } from "office-ui-fabric-react";
import { PeriodosFeriasListProps } from "./PeriodosFeriasList.props";

export function PeriodosFeriasList(props: PeriodosFeriasListProps): JSX.Element {
    const {
        periods,
        onChangeDataInicio,
        onChangeDecimoTerceiro,
        isDisabled
    } = props

    const tokes: IStackTokens = {
        childrenGap: '1rem'
    }

    const _onChangeDataInicio = (index: number, value?: Date): void => {
        if ((value.getDay() === DayOfWeek.Friday) || (value.getDay() === DayOfWeek.Saturday)  || (value.getDay() === DayOfWeek.Sunday) ){
            alert('Não é permitido agendar férias com início às sextas-feiras, sábados ou domingos.');            
            return;
        }
        onChangeDataInicio(index, value)
    }

    const _onChangeDecimoTerceiro = (index: number, value: boolean): void => {
        onChangeDecimoTerceiro(index, value)
    }

    return (
        <Stack>
            {
                periods.map((period, index) => {
                    const {
                        DataInicio,
                        DataFim,
                    } = period

                    const showDecimoTerceiro = DataInicio.getMonth() >= 1 && DataInicio.getMonth() <= 9

                    return (
                        <Stack tokens={tokes} key={index} horizontal>
                            <DatePicker 
                                value={DataInicio} 
                                minDate={index === 0 ? new Date(new Date().setDate(new Date().getDate() + 60)) : periods[index - 1].DataFim}
                                label="Data Início"
                                onSelectDate={(value: Date)=> _onChangeDataInicio(index, value)}
                                disabled={isDisabled}/>
                            <DatePicker 
                                value={DataFim} 
                                minDate={DataFim} 
                                disabled label="Data Fim"/>
                            {/* <TextField value={status} label="Status" readOnly={true} borderless={true}/> */}
                            {showDecimoTerceiro &&
                            <Checkbox label="13° salário" 
                                checked={period.DecimoTerceiro}
                                disabled={isDisabled}
                                onChange={(ev, value: boolean) => _onChangeDecimoTerceiro(index, value)} />}
                        </Stack>
                    )
                })
            }
        </Stack>
    )
}