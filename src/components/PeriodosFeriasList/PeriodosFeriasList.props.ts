import { IDropdownOption } from "office-ui-fabric-react";
import { Periodo } from "../../types/Periodo";

export interface PeriodosFeriasListProps {
  periodos: Periodo[];
  disableFields: boolean;
  minDate: Date;
  options: IDropdownOption[];
  disabledDates: Date[];
  onChangePeriodo: (periodos: Periodo[]) => void;
}
