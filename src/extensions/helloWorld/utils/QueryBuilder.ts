type Expand<T> = {
    [K in keyof T]: Array<keyof T[K]>;
};

type QueryOperations = {
    eq?: string;
    ne?: string;
    gt?: string;
    ge?: string;
    lt?: string;
    le?: string;
};

type QueryExpandableKeys<T> = {
    [K in keyof T]: `${Extract<keyof T, string>}/${Extract<keyof T[K], string>}`;
};
    
type Query<T> = Record<QueryExpandableKeys<T> & keyof T, QueryOperations>;

export type Params<T> = {
    expand?: Partial<Expand<T>>;
    filter?: Query<T>;
};

export function QueryBuilder<T>(params: Params<T>): string {
    const { expand, filter } = params;
    const query: string[] = [];

    if (expand) {
    const keys = Object.keys(expand) as (keyof T)[];

        if (keys.length > 0) {
            const expandQuery: string = `$expand=${keys.join(',')}`;

            const expandableKeysQueryString = keys.map((key) => {
                const value = expand[key] || [];
                return `${String(key)}/${value}`;
            });

            const selectQuery: string = `$select=*,${expandableKeysQueryString.join(',')}`;

            query.push(expandQuery, selectQuery);
        }
    }

    if (filter) {
        const keys = Object.keys(filter) as (keyof T & keyof Query<T>)[];
    
        if (keys.length > 0) {
            const queryFilter: string[] = [];
    
            keys.forEach((key) => {
                const value = filter[key] as QueryOperations;
                const valueKeys = Object.keys(value) as (keyof QueryOperations)[];
    
                if (valueKeys.length > 0) {
                    valueKeys.forEach((valueKey) => {
                        queryFilter.push(`${String(key)} ${valueKey} ${value[valueKey]}`);
                    });
                }
            });
    
            query.push(`$filter=${queryFilter.join(',')}`);
        }
    }

    return query.join('&');
}