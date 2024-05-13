import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { get, merge, post } from "./fetch";
import { ColaboradorProfile } from "../types/ColaboradorProfile";
import { SPGroup } from "../types/SPGroup";
import {
  CreateSolicitacaoFerias,
  SolicitacaoFerias,
} from "../types/SolicitacaoFerias";
import { FeriadosList } from "../consts/FeriadosList";
import { Feriado } from "../types/Feriado";
import { ColaboradoresList } from "../consts/ColaboradoresList";
import { SPUserProfile } from "../types/SPUserProfile";
import { Periodo } from "../types/Periodo";
import { SolicitacaoFeriasList } from "../consts/SolicitacaoFeriasList";
import { PeriodosList } from "../consts/PeriodosList";
//import { Periodo } from "../types/Periodo";

export async function ensureUserByLoginName(
  loginName: string,
  context: FormCustomizerContext
): Promise<SPUserProfile> {
  return post<
    {
      logonName: string;
    },
    SPUserProfile
  >(
    `${
      context.pageContext.web.absoluteUrl
    }/_api/web/ensureuser?loginName=${encodeURIComponent(loginName)}`,
    {
      logonName: loginName,
    },
    context
  );
}

export async function getCurrentUserGroups(
  context: FormCustomizerContext
): Promise<SPGroup[]> {
  const uri = `${context.pageContext.web.absoluteUrl}/_api/web/currentuser/groups`;
  const { value } = await get<{ value: SPGroup[] }>(uri, context);
  return value;
}

export async function isMemberOfGroup(
  groupId: number,
  context: FormCustomizerContext
): Promise<boolean> {
  const userGroups = await getCurrentUserGroups(context);
  const group = userGroups.find((g) => g.Id === groupId);
  return !!group;
}

//Daqui pra baixo possivelmente refatorar

export async function getColaboradorById(
  Id: string,
  context: FormCustomizerContext
): Promise<ColaboradorProfile> {
  const { guid } = ColaboradoresList;
  const urlToFetch = `${context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${guid}')/items(${Id})`;

  return get<ColaboradorProfile>(urlToFetch, context);
}

export async function getColaboradorByEmail(
  email: string,
  context: FormCustomizerContext
): Promise<ColaboradorProfile> {
  const { guid } = ColaboradoresList;
  const urlToFetch = `${context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${guid}')/items?$filter=Email eq '${email}'`;
  const { value } = await get<{ value: ColaboradorProfile[] }>(
    urlToFetch,
    context
  );

  return value[0];
}

export async function getSolicitacaoFeriasForCurrentUser(
  userId: number,
  context: FormCustomizerContext
): Promise<SolicitacaoFerias[]> {
  const { guid } = SolicitacaoFeriasList;
  const { value } = await get<{ value: SolicitacaoFerias[] }>(
    context.pageContext.web.absoluteUrl +
      `/_api/web/lists(guid'${guid}')/items?$filter=AuthorId eq ${userId}&$orderby=ID desc`,
    context
  );

  return value;
}

export async function getSolicitacaoFeriasById(
  itemId: number,
  context: FormCustomizerContext
): Promise<SolicitacaoFerias> {
  const { guid } = SolicitacaoFeriasList;
  const apiUrl =
    context.pageContext.web.absoluteUrl +
    `/_api/web/lists(guid'${guid}')/items(${itemId})`;

  return get<SolicitacaoFerias>(apiUrl, context);
}

export async function updateSolicitacaoFerias(
  id: number,
  data: CreateSolicitacaoFerias,
  context: FormCustomizerContext
): Promise<SolicitacaoFerias> {
  const { InternalName } = SolicitacaoFeriasList;
  const apiUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${InternalName}')/items(${id})`;
  return merge(apiUrl, data, context);
}

export async function getFeriados(
  context: FormCustomizerContext
): Promise<Feriado[]> {
  const { guid } = FeriadosList;
  const urlToFetch = `${context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${guid}')/items`;
  const { value } = await get<{ value: Feriado[] }>(urlToFetch, context);

  value.forEach((item) => {
    item.DataFeriado = new Date(item.DataFeriado);
  });

  return value;
}

export async function getPeriodosBySolicitacaoFeriasId(
  id: number,
  context: FormCustomizerContext
): Promise<Periodo[]> {
  const { guid } = PeriodosList;

  const uri =
    context.pageContext.web.absoluteUrl +
    `/_api/web/lists(guid'${guid}')/items?$filter=SolicitacaoFeriasId eq ${id}`;

  const { value } = await get<{ value: Periodo[] }>(uri, context);

  value.forEach((item) => {
    item.DataInicio = new Date(item.DataInicio);
    item.DataFim = new Date(item.DataFim);
  });

  return value;
}

export async function createSolicitacaoFerias(
  solicitacaoFerias: CreateSolicitacaoFerias,
  context: FormCustomizerContext
): Promise<SolicitacaoFerias> {
  const { guid } = SolicitacaoFeriasList;
  const { ...data } = solicitacaoFerias;

  const uri = `${context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${guid}')/items`;

  return await post<CreateSolicitacaoFerias, SolicitacaoFerias>(
    uri,
    data,
    context
  );
}

export async function createPeriodo(
  periodo: Periodo,
  context: FormCustomizerContext
): Promise<Periodo> {
  const { guid } = PeriodosList;
  const { ...data } = periodo;

  const uri = `${context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${guid}')/items`;

  return await post<Periodo, Periodo>(uri, data, context);
}

// export async function _updateItem(
//   item: FormSolicitacaoFeriasProps["item"],
//   periods: FormSolicitacaoFeriasProps["periodos"]
// ): Promise<any> {
//   const { guid } = this.context.list;
//   const { ...itemToSave } = item;

//   const apiUrl =
//     this.context.pageContext.web.absoluteUrl +
//     `/_api/web/lists(guid'${guid}')/items(${this.context.pageContext.listItem.id})`;

//   await this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
//     headers: {
//       "Content-Type": "application/json;odata.metadata=none",
//       "IF-MATCH": "*",
//       "X-HTTP-Method": "MERGE",
//       accept: "application/json;odata=verbose",
//     },
//     body: JSON.stringify(itemToSave),
//   });

//   if (this.periodos.length > 0) {
//     await Promise.all(
//       this.periodos.map(
//         async (periodo) => await this.deleteItemFromSecondaryList(periodo.Id)
//       )
//     );
//     this.periodos = [];
//   }

//   for (const period of periods) {
//     await this.createOnSecondaryList({
//       ...period,
//       SolicitacaoFeriasId: this.context.pageContext.listItem.id,
//     });
//   }

//   return Promise.resolve();
// }

// export async function deleteItemFromSecondaryList(id: number): Promise<void> {
//   const apiUrl =
//     this.context.pageContext.web.absoluteUrl +
//     `/_api/web/lists(guid'${this.secondaryListId}')/items(${id})`;

//   const response = await this.context.spHttpClient.fetch(
//     apiUrl,
//     SPHttpClient.configurations.v1,
//     {
//       method: "DELETE",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         "IF-MATCH": "*",
//       },
//     }
//   );

//   if (response.ok) {
//     return Promise.resolve();
//   } else {
//     await Promise.reject(response.statusText);
//   }
// }
