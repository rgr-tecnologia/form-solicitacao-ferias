import * as React from "react";
import { DatePicker, IStackTokens, Stack, TextField } from "office-ui-fabric-react";
import { PeriodosFeriasListProps } from "./PeriodosFeriasList.props";

export function PeriodosFeriasList(props: PeriodosFeriasListProps): JSX.Element {
    const {
        periods
    } = props
    const tokes: IStackTokens = {
        childrenGap: '1rem'
    }

    return (
        <Stack>
            {
                periods.map((period, index) => {
                    const {
                        dataInicio,
                        dataFim,
                        status
                    } = period
                    return (
                        <Stack tokens={tokes} key={index} horizontal>
                            <DatePicker value={dataInicio} minDate={dataInicio} label="Data Início"/>
                            <DatePicker value={dataFim} minDate={dataFim} disabled label="Data Fim"/>
                            <TextField value={status} label="Status" readOnly={true}/>
                        </Stack>
                    )
                })
            }
        </Stack>
    )
}