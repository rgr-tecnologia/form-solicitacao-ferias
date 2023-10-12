import { useFetch } from './useFetch';

type useGetResult<T> = [data: T[], isLoading: boolean]

export function useGet<T>(route: string): useGetResult<T> {
    return useFetch<T>(route, {
        method: 'GET',
        headers: {
            'Accept': "application/json;odata=nometadata"      
        }
    });
}