export type Feriado = {
    nome: string;
    DiaFeriado: number;
    MesFeriado: number;
}

export async function useFeriados(): Promise<Feriado[]> {
    const listGUID = '2138f07d-07f7-4a45-b4de-9fa877e3ca55'
    const API_URL = `https://cjinter.sharepoint.com/sites/newportal/_api/web/lists(guid'${listGUID}')/items`
    const response = await fetch(API_URL, {
        headers: {
            Accept : 'application/json'
        }
    })

    const responseJSON = await response.json()
    const feriados = responseJSON.value

    return feriados
}