import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';

export interface IViewFormSolicitacaoFeriasProps {
    item: IListSolicitacaoFeriasItem;
    isUserManager: boolean;
    onChangeObservacoesGestor: () => void
}