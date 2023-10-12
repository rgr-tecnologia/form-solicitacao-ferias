import { Params } from '../extensions/helloWorld/utils/QueryBuilder';
import { Hierarquia } from './useHierarquia';
import { Repository, useRepository,  } from './useRepository';

type Author = {
    Title: string;
}

type ExpandableFields = {
    Author: Author;
    NomeColaborador: Hierarquia;
}

export type ControleFerias = {
    Id: number;
    InicioPeriodoAtual: Date;
    FimPeriodoAtual: Date;
    DataLimiteAgendarFerias: Date;
    DataLimiteSairFerias: Date;
    SaldoDias: number;
} & ExpandableFields;

export function useControleFerias(params?: Params<ControleFerias>): Repository<ControleFerias>{
    return useRepository<ControleFerias>({
        source: {
            guid: '95a4f6c1-9837-4f6e-bcb5-488115e6a417',
        },
        params: {
            ...params,
            expand: {
                NomeColaborador: ['NAME_EMPLOYEE'],
            }
        }
    });
}