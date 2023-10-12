import { FormDisplayMode } from '@microsoft/sp-core-library';
import { PeriodItem } from '../PeriodosFeriasList/PeriodosFeriasList.props';
import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';
export interface IFormSolicitacaoFeriasProps {
    displayMode: FormDisplayMode;
    etag?: string;
    item: IListSolicitacaoFeriasItem;
    onSave: (item: IListSolicitacaoFeriasItem, periods: PeriodItem[]) => void;
    onClose: () => void;
    userItems?: IListSolicitacaoFeriasItem[];
    isUserManager: boolean;
    isMemberOfHR: boolean;
    isAuthor: boolean;
    periods: PeriodItem[];
    userDisplayName: string;
    updateItem: any;
  }