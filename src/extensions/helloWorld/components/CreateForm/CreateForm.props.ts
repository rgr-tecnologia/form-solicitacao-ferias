//Types
import { IFormOnChangeHandlerProps } from '../FormSolicitacaoFerias/FormSolicitacaoFerias'
import { StatusSolicitacaoFerias } from '../../../../enums/StatusSolicitacaoFerias';

export interface ICreateFormFeriasProps {
  observacoes: string;
  observacoesGestor: string;
  observacoesRH: string;
  selectedKey: number,
  status: StatusSolicitacaoFerias,
  onChangeHandler: (props: IFormOnChangeHandlerProps) => void;
}