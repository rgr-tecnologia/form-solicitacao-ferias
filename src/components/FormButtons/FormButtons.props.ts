import { FormDisplayMode } from "@microsoft/sp-core-library";
import { StatusSolicitacaoFerias } from "../../enums/StatusSolicitacaoFerias";

export interface FormButtons {
  displayMode: FormDisplayMode;
  isUserManager: boolean;
  isMemberOfHR: boolean;
  isAuthor: boolean;
  status: StatusSolicitacaoFerias;
  onSend: () => void;
  onClose: () => void;
  onApproveManager: () => void;
  onRejectManager: () => void;
  onApproveHR: () => void;
  onRejectHR: () => void;
  onSaveHR: () => void;
}
