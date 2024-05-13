import { CreateSolicitacaoFerias } from "../../types/SolicitacaoFerias";

export interface ViewFormSolicitacaoFeriasProps {
  formData: CreateSolicitacaoFerias;
  isUserManager: boolean;
  isMemberOfHR: boolean;
  onChange: (props: CreateSolicitacaoFerias) => void;
}
