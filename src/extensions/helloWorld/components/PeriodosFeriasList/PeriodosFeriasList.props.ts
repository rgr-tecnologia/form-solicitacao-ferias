import { IDropdownOption } from "office-ui-fabric-react";

export interface PeriodosFeriasListProps {
    periods: PeriodItem[];
    disableDataInicio: boolean;
    disableDecimoTerceiro: boolean;
    minDate: Date;
    options: IDropdownOption[];
    onChangeDataInicio?: (index: number, newDate: Date) => void;
    onChangeDecimoTerceiro?: (index: number, value: boolean) => void;
    onChangeQuantidadeDias?: (index: number, value: IDropdownOption) => void;
}

export interface PeriodItem {
    Id?: number
    DataInicio: Date
    DataFim: Date
    SolicitacaoFeriasId?: number
    DecimoTerceiro: boolean
    QuantidadeDias: number
}