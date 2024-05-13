import { QuantidadeDiasOptionText } from "../enums/QuantidadeDiasOption";
import { StatusSolicitacaoFerias } from "../enums/StatusSolicitacaoFerias";

export type SolicitacaoFerias = {
  Id: number;
  AbonoQuantidadeDias: number;
  AuthorId: number;
  ColaboradorId: number;
  GestorId: number;
  Observacao: string;
  ObservacaoGestor: string;
  ObservacaoRH: string;
  PeriodoAquisitivo: string;
  QtdDias: QuantidadeDiasOptionText;
  Status: StatusSolicitacaoFerias;
};

export type CreateSolicitacaoFerias = Omit<SolicitacaoFerias, "Id">;

export type UpdateSolicitacaoFerias = Omit<SolicitacaoFerias, "Id">;
