import * as React from 'react';
import { Params, QueryBuilder } from '../extensions/helloWorld/utils/QueryBuilder';
import { useGet } from './useGet';

type Source = { 
    guid: string;
}

type Field<T> = {
    Title: keyof T;
}

type ChoiceField<T> = {
    choices: string[];
} & Field<T>

type LookupField<T> = {
    lookup: string[];
} & Field<T>

type RepositoryProps<T> = {
    source: Source;
    params: Params<T>;
}

export type Repository<T> = [
    fields: (Field<T> | ChoiceField<T> | LookupField<T>)[],
    items: T[],
    isLoading: boolean,
]

export function useRepository<T>({source, params} : RepositoryProps<T>): Repository<T> {
    const queryString = React.useMemo(() => {
        return QueryBuilder<T>(params)
    }, [params])

    const [fields, isLoadingFields] = useGet<Field<T> | ChoiceField<T> | LookupField<T>>(`lists(guid'${source.guid}')/fields`)
    const [items, isLoadingItems] = useGet<T>(`lists(guid'${source.guid}')/items?${queryString}`)

    return [
        fields,
        items,
        isLoadingFields || isLoadingItems
    ]
}