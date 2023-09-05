import * as React from "react";
import { DatePicker, DayOfWeek, IStackTokens, Stack } from "office-ui-fabric-react";
import { PeriodosFeriasListProps } from "./PeriodosFeriasList.props";

export function PeriodosFeriasList(props: PeriodosFeriasListProps): JSX.Element {
    const {
        periods,
        onChangeDataInicio
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

    return (
        <Stack>
            {
                periods.map((period, index) => {
                    const {
                        dataInicio,
                        dataFim,
                    } = period
                    return (
                        <Stack tokens={tokes} key={index} horizontal>
                            <DatePicker 
                                value={dataInicio} 
                                minDate={dataInicio} 
                                label="Data Início"
                                onSelectDate={(value: Date)=> _onChangeDataInicio(index, value)}/>
                            <DatePicker 
                                value={dataFim} 
                                minDate={dataFim} 
                                disabled label="Data Fim"/>
                            {/* <TextField value={status} label="Status" readOnly={true} borderless={true}/> */}
                        </Stack>
                    )
                })
            }
        </Stack>
    )
}