import { FormDisplayMode } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';
import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';

export interface IFormSolicitacaoFeriasProps {
    context: FormCustomizerContext;
    displayMode: FormDisplayMode;
    etag?: string;
    item: IListSolicitacaoFeriasItem;
    onSave: (item: IListSolicitacaoFeriasItem) => void;
    onClose: () => void;
    userItems?: IListSolicitacaoFeriasItem[];
    isUserManager: boolean;
    isMemberOfHR: boolean;
    isAuthor: boolean;
  }