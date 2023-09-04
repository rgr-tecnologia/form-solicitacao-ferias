import IListSolicitacaoFeriasItem from '../SoliticitacaoFerias';

export interface IViewFormSolicitacaoFeriasProps {
    item: IListSolicitacaoFeriasItem;
    isUserManager: boolean;
    isMemberOfHR: boolean;
    onChangeObservacoesGestor: () => void
}