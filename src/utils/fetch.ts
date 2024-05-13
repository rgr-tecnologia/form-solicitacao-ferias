import { SPHttpClient } from "@microsoft/sp-http";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";

const config = SPHttpClient.configurations.v1;

export async function get<T>(
  url: string,
  context: FormCustomizerContext,
  options?: RequestInit
): Promise<T> {
  const response = await context.spHttpClient.get(url, config, {
    headers: {
      accept: "application/json;odata.metadata=none",
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
}

export async function post<T, K>(
  url: string,
  data: T,
  context: FormCustomizerContext
): Promise<K> {
  const response = await context.spHttpClient.post(url, config, {
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as K;
}

export async function merge<T>(
  url: string,
  data: T,
  context: FormCustomizerContext,
  options?: RequestInit
): Promise<void> {
  const response = await context.spHttpClient.post(url, config, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "IF-MATCH": "*",
      "X-HTTP-Method": "MERGE",
      accept: "application/json;odata=verbose",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return;
}

export async function patch<T>(
  url: string,
  data: T,
  context: FormCustomizerContext,
  options?: RequestInit
): Promise<T> {
  const response = await context.spHttpClient.post(url, config, {
    headers: {
      "Content-Type": "application/json;odata.metadata=none",
      "IF-MATCH": "*",
      "X-HTTP-Method": "PATCH",
      accept: "application/json;odata=verbose",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
}

export async function del(
  url: string,
  context: FormCustomizerContext,
  options?: RequestInit
): Promise<void> {
  const response = await context.spHttpClient.post(url, config, {
    headers: {
      "Content-Type": "application/json;odata.metadata=none",
      "IF-MATCH": "*",
      "X-HTTP-Method": "DELETE",
      accept: "application/json;odata=verbose",
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
}
