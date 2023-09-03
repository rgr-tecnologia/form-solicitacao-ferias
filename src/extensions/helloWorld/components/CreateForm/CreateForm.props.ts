//Types
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';
import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';
import { IFormOnChangeHandlerProps } from '../FormSolicitacaoFerias/FormSolicitacaoFerias'

export interface ICreateFormFeriasProps {
  context: FormCustomizerContext;
  item: IListSolicitacaoFeriasItem;
  onChangeHandler: (props: IFormOnChangeHandlerProps) => void;
}