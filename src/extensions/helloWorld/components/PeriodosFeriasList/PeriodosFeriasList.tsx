import * as React from "react";
import { Checkbox, DatePicker, DayOfWeek, IStackTokens, Label, Stack, Text } from "office-ui-fabric-react";
import { PeriodosFeriasListProps } from "./PeriodosFeriasList.props";

export function PeriodosFeriasList(props: PeriodosFeriasListProps): JSX.Element {
    const {
        periods,
        onChangeDataInicio,
        onChangeDecimoTerceiro,
        isDisabled
    } = props

    const tokens: IStackTokens = {
        childrenGap: 16,
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
        <Stack tokens={tokens}>
            <Stack 
                horizontal 
                horizontalAlign="space-around" 
                verticalAlign="center">

                <Label>Período</Label>
                <Label>Data Início</Label>
                <Label>Data Fim</Label>
                <Label>13° salário?</Label>
            </Stack>
            {
                periods.map((period, index) => {
                    const {
                        DataInicio,
                        DataFim,
                    } = period

                    const enableDecimoTerceiro = DataInicio.getMonth() >= 1 && DataInicio.getMonth() <= 9

                    return (
                        <>                        
                            <Stack
                                key={index} 
                                horizontal
                                horizontalAlign="space-around"
                                tokens={tokens}>

                                <Stack verticalAlign="center">
                                    <Text>
                                        {index + 1}° período
                                    </Text>
                                </Stack>

                                <DatePicker 
                                    value={DataInicio} 
                                    minDate={index === 0 ? new Date(new Date().setDate(new Date().getDate() + 60)) : periods[index - 1].DataFim}
                                    onSelectDate={(value: Date)=> _onChangeDataInicio(index, value)}
                                    disabled={isDisabled} />
                                <DatePicker 
                                    value={DataFim} 
                                    minDate={DataFim} 
                                    disabled />
                                {/* <TextField value={status} label="Status" readOnly={true} borderless={true}/> */}

                                <Stack verticalAlign="center">
                                    <Checkbox label="13° salário" 
                                        checked={period.DecimoTerceiro}
                                        disabled={isDisabled || !enableDecimoTerceiro}
                                        onChange={(ev, value: boolean) => _onChangeDecimoTerceiro(index, value)} />
                                </Stack>

                            </Stack>
                        </>
                    )
                })
            }
        </Stack>
    )
}