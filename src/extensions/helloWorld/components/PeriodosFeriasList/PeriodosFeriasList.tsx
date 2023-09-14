import * as React from "react";
import { Checkbox, DatePicker, Dropdown, IStackTokens, Label, Stack, Text } from "office-ui-fabric-react";
import { PeriodosFeriasListProps } from "./PeriodosFeriasList.props";

export function PeriodosFeriasList(props: PeriodosFeriasListProps): JSX.Element {
    const {
        periods,
        onChangeDataInicio,
        onChangeDecimoTerceiro,
        onChangeQuantidadeDias,
        disableFields,
        minDate,
        options
    } = props

    const tokens: IStackTokens = {
        childrenGap: 12,
    }

    const style: React.CSSProperties ={
        width: "20%",
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
            {
                periods.map((period, index) => {
                    const {
                        DataInicio,
                        DataFim,
                        QuantidadeDias,
                    } = period

                    const enableDecimoTerceiro = DataInicio.getMonth() >= 1 && DataInicio.getMonth() <= 9
                    const selectedKey = options.find(option => option.text === QuantidadeDias?.toString())?.key ?? null

                    return (
                        <>                        
                            <Stack
                                key={index} 
                                horizontal
                                horizontalAlign="space-around"
                                tokens={tokens}>

                                <Stack verticalAlign="center" style={style}>
                                    <Text>
                                        {index + 1}° período
                                    </Text>
                                </Stack>

                                <Stack style={style}>
                                    <Dropdown 
                                        options={options}
                                        selectedKey={selectedKey}
                                        onChange={(ev, option) => onChangeQuantidadeDias(index, option)}
                                        disabled={disableFields}
                                    />
                                </Stack>

                                <Stack style={style}>
                                    <DatePicker 
                                        value={DataInicio} 
                                        minDate={index === 0 ? minDate : periods[index-1].DataFim}
                                        onSelectDate={(value: Date)=> _onChangeDataInicio(index, value)}
                                        formatDate={(date: Date) => date.toLocaleDateString()}
                                        disabled={disableFields} />
                                </Stack>

                                <Stack style={style}>
                                    <DatePicker 
                                        value={DataFim}
                                        formatDate={(date: Date) => date.toLocaleDateString()}
                                        disabled />
                                </Stack>

                                <Stack style={style} verticalAlign="center">
                                    <Checkbox label="13° salário" 
                                        checked={period.DecimoTerceiro}
                                        disabled={disableFields || !enableDecimoTerceiro}
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