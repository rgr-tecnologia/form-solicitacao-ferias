import { Repository, useRepository } from "./useRepository";
import { Params } from "../extensions/helloWorld/utils/QueryBuilder";

export type Feriado = {
    nome: string;
    DiaFeriado: number;
    MesFeriado: number;
}


export function useFeriados(params: Params<Feriado>): Repository<Feriado> {
    const repository = useRepository<Feriado>({
        source: {
            guid: '2138f07d-07f7-4a45-b4de-9fa877e3ca55',
        },
        params
    });

    return repository
}