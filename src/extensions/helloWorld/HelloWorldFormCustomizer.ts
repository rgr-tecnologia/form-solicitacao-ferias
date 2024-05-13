import * as React from "react";
import * as ReactDOM from "react-dom";

import { FormDisplayMode } from "@microsoft/sp-core-library";

import { BaseFormCustomizer } from "@microsoft/sp-listview-extensibility";

import {
  createPeriodo,
  createSolicitacaoFerias,
  ensureUserByLoginName,
  getColaboradorByEmail,
  getColaboradorById,
  getFeriados,
  getSolicitacaoFeriasForCurrentUser,
  getSolicitacaoFeriasById,
  isMemberOfGroup,
  updateSolicitacaoFerias,
  getPeriodosBySolicitacaoFeriasId,
} from "../../utils/lib";
import { FormSolicitacaoFeriasProps } from "../../components/FormSolicitacaoFerias/FormSolicitacaoFerias.props";
import FormSolicitacaoFerias from "../../components/FormSolicitacaoFerias/FormSolicitacaoFerias";
import { ColaboradorProfile } from "../../types/ColaboradorProfile";
export interface IHelloWorldFormCustomizerProperties {
  sampleText?: string;
}

export default class HelloWorldFormCustomizer extends BaseFormCustomizer<IHelloWorldFormCustomizerProperties> {
  private item: FormSolicitacaoFeriasProps["item"] = {
    AbonoQuantidadeDias: 0,
    AuthorId: null,
    ColaboradorId: null,
    GestorId: null,
    Observacao: null,
    ObservacaoRH: "",
    PeriodoAquisitivo: new Date().toISOString(),
    QtdDias: "30 dias de descanso",
    ObservacaoGestor: "",
    Status: "Draft",
  };

  private colaborador: ColaboradorProfile = null;

  private periodos: FormSolicitacaoFeriasProps["periodos"] = [];
  private historico: FormSolicitacaoFeriasProps["historico"] = [];
  private feriados: FormSolicitacaoFeriasProps["feriados"] = [];

  private isUserManager: boolean = false;
  private isMemberOfHR: boolean = false;

  private async onInitNewForm(): Promise<void> {
    try {
      this.feriados = await getFeriados(this.context);

      this.colaborador = await getColaboradorByEmail(
        this.context.pageContext.user.loginName,
        this.context
      );

      const manager = await getColaboradorById(
        this.colaborador.GestorId.toString(),
        this.context
      );

      const managerLoginname = `i:0#.f|membership|${manager.Email}`;

      const managerProfile = await ensureUserByLoginName(
        managerLoginname,
        this.context
      );

      this.item.ColaboradorId = this.colaborador.Id;
      this.item.GestorId = managerProfile.Id;
    } catch (error) {
      throw Error(error);
    }
  }

  private async onInitEditForm(): Promise<void> {
    try {
      this.item = await getSolicitacaoFeriasById(
        this.context.itemId,
        this.context
      );

      this.periodos = await getPeriodosBySolicitacaoFeriasId(
        this.context.pageContext.listItem.id,
        this.context
      );

      this.historico = await getSolicitacaoFeriasForCurrentUser(
        this.item.AuthorId,
        this.context
      );

      this.colaborador = await getColaboradorById(
        this.item.ColaboradorId.toString(),
        this.context
      );

      this.isUserManager =
        this.item.GestorId ===
        this.context.pageContext.legacyPageContext.userId;
      this.isMemberOfHR = await isMemberOfGroup(139, this.context);
    } catch (error) {
      throw Error(error);
    }
  }

  public async onInit(): Promise<void> {
    this.item.AuthorId = this.context.pageContext.legacyPageContext.userId;
    this.historico = await getSolicitacaoFeriasForCurrentUser(
      this.context.pageContext.legacyPageContext.userId,
      this.context
    );

    if (this.displayMode === FormDisplayMode.New) {
      await this.onInitNewForm();
    } else {
      await this.onInitEditForm();
    }
  }

  public render(): void {
    const helloWorld: React.ReactElement<{}> = React.createElement(
      FormSolicitacaoFerias,
      {
        displayMode: this.displayMode,
        item: this.item,
        onSave: this.onSave,
        onClose: this.onClose,
        isUserManager: this.isUserManager,
        isMemberOfHR: this.isMemberOfHR,
        isAuthor:
          this.item.AuthorId ===
          this.context.pageContext.legacyPageContext.userId,
        historico: this.historico,
        periodos: this.periodos,
        userDisplayName: this.context.pageContext.user.displayName,
        updateItem: updateSolicitacaoFerias,
        feriados: this.feriados,
        colaborador: this.colaborador,
      }
    );

    ReactDOM.render(helloWorld, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private onSave = async (
    solicitacaoFerias: FormSolicitacaoFeriasProps["item"],
    periodos: FormSolicitacaoFeriasProps["periodos"]
  ): Promise<Promise<void>> => {
    if (this.displayMode === FormDisplayMode.New) {
      const solicitacaoFeriasResponse = await createSolicitacaoFerias(
        solicitacaoFerias,
        this.context
      );

      periodos.map(async (periodo) => {
        await createPeriodo(
          {
            ...periodo,
            SolicitacaoFeriasId: solicitacaoFeriasResponse.Id,
          },
          this.context
        );
      });
    } else {
      const id = this.context.pageContext.listItem.id;
      await updateSolicitacaoFerias(id, solicitacaoFerias, this.context);
    }

    window.location.reload();
  };

  private onClose = (): void => {
    window.location.href = "/sites/newportal";
  };
}
