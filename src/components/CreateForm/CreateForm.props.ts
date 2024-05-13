//Types
import { QuantidadeDiasOptionText } from "../../enums/QuantidadeDiasOption";
import { CreateSolicitacaoFerias } from "../../types/SolicitacaoFerias";

export interface CreateFormFeriasProps {
  formData: CreateSolicitacaoFerias;
  onChange: (props: CreateSolicitacaoFerias) => void;
  onChangeModalidade: (modalidade: QuantidadeDiasOptionText) => void;
}
