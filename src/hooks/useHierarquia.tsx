import { Params } from '../extensions/helloWorld/utils/QueryBuilder';
import { Repository, useRepository } from './useRepository';

export type Hierarquia = {
    NAME_EMPLOYEE: string
}

export function useHierarquia(params: Params<Hierarquia>): Repository<Hierarquia> {
    const repository = useRepository<Hierarquia>({
        source: {
            guid: '1733062b-2634-43fc-8207-42fe20b40ac4',
        },
        params
    });

    return repository
}