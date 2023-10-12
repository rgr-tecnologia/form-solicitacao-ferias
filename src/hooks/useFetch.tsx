import * as React from 'react';

type useFetch<T> = [data: T[], isLoading: boolean]

export function useFetch<T>(route: string, init?: RequestInit): useFetch<T> {
    const [data, setData] = React.useState<T[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const apiURL = React.useMemo(() => {
        return `https://cjinter.sharepoint.com/sites/newportal/_api/web/${route}`
    }, [route]);

    React.useEffect(() => {
        fetch(apiURL, init)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setData(data.value);
                setIsLoading(false);
            })
            .catch((error) => {
                // Handle the error here, e.g., set an error state.
                setIsLoading(false);
                console.error('API request error:', error);
            });
    }, [apiURL]);

    return [
        data,
        isLoading,
    ];
}