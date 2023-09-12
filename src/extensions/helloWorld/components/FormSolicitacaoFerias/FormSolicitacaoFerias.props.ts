import { FormDisplayMode } from '@microsoft/sp-core-library';
import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';

export interface IFormSolicitacaoFeriasProps {
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