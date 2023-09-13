import * as React from "react";
import { Checkbox, DatePicker, IStackTokens, Label, Stack, Text } from "office-ui-fabric-react";
import { PeriodosFeriasListProps } from "./PeriodosFeriasList.props";

export function PeriodosFeriasList(props: PeriodosFeriasListProps): JSX.Element {
    const {
        periods,
        onChangeDataInicio,
        onChangeDecimoTerceiro,
        disableDataInicio,
        disableDecimoTerceiro,
        minDate,
    } = props

    const tokens: IStackTokens = {
        childrenGap: 16,
    }

    const _onChangeDataInicio = (index: number, value?: Date): void => {
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

                <Stack>
                    <Label>Período</Label>
                </Stack>
                <Stack>
                    <Label>Data Início</Label>
                </Stack>
                <Stack>
                    <Label>Data Fim</Label>
                </Stack>
                <Stack>
                    <Label>13° salário?</Label>
                </Stack>
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
                                    minDate={index === 0 ? minDate : periods[index-1].DataFim}
                                    onSelectDate={(value: Date)=> _onChangeDataInicio(index, value)}
                                    formatDate={(date: Date) => date.toLocaleDateString()}
                                    disabled={disableDataInicio} />

                                <DatePicker 
                                    value={DataFim}
                                    formatDate={(date: Date) => date.toLocaleDateString()}
                                    disabled />

                                <Stack verticalAlign="center">
                                    <Checkbox label="13° salário" 
                                        checked={period.DecimoTerceiro}
                                        disabled={disableDecimoTerceiro || !enableDecimoTerceiro}
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