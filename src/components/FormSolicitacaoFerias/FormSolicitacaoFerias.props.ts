import { FormDisplayMode } from "@microsoft/sp-core-library";
import {
  CreateSolicitacaoFerias,
  SolicitacaoFerias,
} from "../../types/SolicitacaoFerias";
import { Feriado } from "../../types/Feriado";
import { Periodo } from "../../types/Periodo";
import { ColaboradorProfile } from "../../types/ColaboradorProfile";
export interface FormSolicitacaoFeriasProps {
  displayMode: FormDisplayMode;
  etag?: string;
  item: CreateSolicitacaoFerias;
  onSave: (item: CreateSolicitacaoFerias, periods: Periodo[]) => void;
  onClose: () => void;
  historico: SolicitacaoFerias[];
  isUserManager: boolean;
  isMemberOfHR: boolean;
  isAuthor: boolean;
  periodos: Periodo[];
  userDisplayName: string;
  updateItem: unknown;
  feriados: Feriado[];
  colaborador: ColaboradorProfile;
}
