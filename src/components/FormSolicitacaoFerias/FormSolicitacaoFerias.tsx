import * as React from "react";

//UI components
import { Stack, IStackTokens, IStackStyles } from "@fluentui/react/lib/Stack";
import SolicitacoesList from "../SolicitacoesList/SolicitacoesList";

//Forms components
import CreateForm from "../CreateForm/CreateForm";
import ViewForm from "../ViewForm/ViewForm";

//Types
import { Label, Text, TextField } from "office-ui-fabric-react";
import { FormSolicitacaoFeriasProps } from "./FormSolicitacaoFerias.props";
import { FormButtons } from "../FormButtons/FormButtons";
import { useQuantidadeDiasOptions } from "../../hooks/useQuantidadeDiasOptions";
import { PeriodosFeriasList } from "../PeriodosFeriasList/PeriodosFeriasList";
import { QuantidadeDiasOptionText } from "../../enums/QuantidadeDiasOption";
import { FormDisplayMode } from "@microsoft/sp-core-library";
import { Disclaimer } from "../disclaimer/Disclaimer";
import {
  CreateSolicitacaoFerias,
  SolicitacaoFerias,
} from "../../types/SolicitacaoFerias";
import { Periodo } from "../../types/Periodo";
import { validateForm } from "../../validators/validateForm";
import { createPeriodos } from "../../utils/createPeriodos";

export default function FormSolicitacaoFerias(
  props: FormSolicitacaoFeriasProps
): React.ReactElement<FormSolicitacaoFeriasProps> {
  const {
    displayMode,
    onSave: _onSave,
    onClose,
    isUserManager,
    isMemberOfHR,
    isAuthor,
    historico,
    item,
    periodos: initialPeriodos,
    feriados,
    colaborador,
  } = props;

  const { Status } = item;

  const historicoOrdenadoById = historico.sort((a, b) => {
    return a.Id - b.Id;
  });

  const periodoAquisitivoAtual = new Date(colaborador.DataAdmissao);

  if (historicoOrdenadoById.length) {
    periodoAquisitivoAtual.setFullYear(
      new Date(
        historicoOrdenadoById[
          historicoOrdenadoById.length - 1
        ].PeriodoAquisitivo
      ).getFullYear()
    );
  }

  const [formData, setFormData] =
    React.useState<FormSolicitacaoFeriasProps["item"]>(item);

  const QuantidadeDiasOptions = useQuantidadeDiasOptions();

  const disabledDates = feriados
    .map((feriado) => {
      const date = feriado.DataFeriado.getDate();
      const month = feriado.DataFeriado.getMonth();

      return Array(3)
        .fill({})
        .map((_, index) => {
          const year = new Date().getFullYear() + index;

          return new Date(year, month, date);
        });
    })
    .flat();

  const minDate =
    formData.Status === "Approved by HR" ||
    (formData.Status === "Edited by HR" && isMemberOfHR)
      ? new Date()
      : new Date(new Date().setDate(new Date().getDate() + 45));

  const disableFields =
    formData.Status === "Draft" ||
    formData.Status === "Rejected by HR" ||
    (formData.Status === "Rejected by manager" && isAuthor) ||
    formData.Status === "Approved by HR" ||
    (formData.Status === "Edited by HR" && isMemberOfHR);

  const [periodos, setPeriodos] = React.useState<Periodo[]>(
    initialPeriodos.length
      ? initialPeriodos
      : createPeriodos(QuantidadeDiasOptions[0], minDate)
  );
  const [errors, setErrors] = React.useState<Error[]>([]);

  const periodosOptions = React.useMemo(() => {
    const selectedQuantidadeDias = QuantidadeDiasOptions.find((option) => {
      return option.text === formData.QtdDias;
    });

    return selectedQuantidadeDias.options.map((option, index) => {
      return {
        key: index,
        text: option.totalDias.toString(),
      };
    });
  }, [formData.QtdDias]);

  const onSave = React.useCallback(
    (item: CreateSolicitacaoFerias) => {
      _onSave(
        {
          ...item,
        },
        periodos
      );
    },
    [item, periodos]
  );

  const onSend = (): void => {
    const errorList = validateForm(formData, periodos, periodoAquisitivoAtual);
    const isFormValid = errorList.length > 0 ? false : true;

    if (!isFormValid) {
      setErrors(errorList);
      throw errorList[0];
    }

    onSave({
      ...formData,
      Status: "In review by manager",
    });
  };

  const onApproveManager = (): void => {
    const errorList = validateForm(formData, periodos, periodoAquisitivoAtual);
    const isFormValid = errorList.length > 0 ? false : true;

    if (!isFormValid) {
      setErrors(errorList);
      throw errorList[0];
    }

    onSave({
      ...formData,
      Status: "Approved by manager",
    });
  };

  const onRejectManager = (): void => {
    const errorList = validateForm(formData, periodos, periodoAquisitivoAtual);
    const isFormValid = errorList.length > 0 ? false : true;

    if (!isFormValid) {
      setErrors(errorList);
      throw errorList[0];
    }

    onSave({
      ...formData,
      Status: "Rejected by manager",
    });
  };

  const onApproveHR = async (): Promise<void> => {
    const errorList = validateForm(formData, periodos, periodoAquisitivoAtual);
    const isFormValid = errorList.length > 0 ? false : true;

    if (!isFormValid) {
      setErrors(errorList);
      throw errorList[0];
    }

    onSave({
      ...formData,
      Status: "Approved by HR",
    });
  };

  const onRejectHR = (): void => {
    const errorList = validateForm(formData, periodos, periodoAquisitivoAtual);
    const isFormValid = errorList.length > 0 ? false : true;

    if (!isFormValid) {
      setErrors(errorList);
      throw errorList[0];
    }

    onSave({
      ...formData,
      Status: "Rejected by HR",
    });
  };

  const onSaveHR = (): void => {
    const errorList = validateForm(formData, periodos, periodoAquisitivoAtual);
    const isFormValid = errorList.length > 0 ? false : true;

    if (!isFormValid) {
      setErrors(errorList);
      throw errorList[0];
    }

    onSave({
      ...formData,
      Status: "Edited by HR",
    });
  };

  const onChangeModalidade = (
    selectedOptionText: QuantidadeDiasOptionText
  ): void => {
    const selectedQuantidadeDias = QuantidadeDiasOptions.find((option) => {
      return option.text === selectedOptionText;
    });
    const newPeriodos = createPeriodos(selectedQuantidadeDias, minDate);
    setPeriodos(newPeriodos);
    setFormData({
      ...formData,
      QtdDias: selectedOptionText,
      AbonoQuantidadeDias: selectedQuantidadeDias.totalDiasAbono,
    });
  };

  const onChangeSolicitacaoFerias = (
    formData: CreateSolicitacaoFerias
  ): void => {
    setFormData(formData);
  };

  let formElement: JSX.Element;

  if (
    Status === "Draft" ||
    Status === "Rejected by manager" ||
    Status === "Rejected by HR"
  ) {
    formElement = (
      <CreateForm
        formData={formData}
        onChange={onChangeSolicitacaoFerias}
        onChangeModalidade={onChangeModalidade}
      />
    );
  } else {
    formElement = (
      <ViewForm
        formData={formData}
        onChange={onChangeSolicitacaoFerias}
        onChangeModalidade={onChangeModalidade}
        isUserManager={isUserManager}
        isMemberOfHR={isMemberOfHR}
      />
    );
  }

  const orderByPeriodoAquisitivo = (
    solicitacaoFerias: SolicitacaoFerias[]
  ): SolicitacaoFerias[] => {
    const lastItem = solicitacaoFerias.sort((a, b) => {
      return (
        new Date(b.PeriodoAquisitivo).getFullYear() -
        new Date(a.PeriodoAquisitivo).getFullYear()
      );
    });

    return lastItem;
  };

  if (displayMode === FormDisplayMode.New) {
    const historicoOrdenado = orderByPeriodoAquisitivo(historico);
    const periodoAquisitivoAtual = historicoOrdenado.length
      ? new Date(
          historicoOrdenado[historicoOrdenado.length - 1].PeriodoAquisitivo
        )
      : new Date(colaborador.DataAdmissao);
    const fimPeriodoAquisitivoAtual = periodoAquisitivoAtual;
    fimPeriodoAquisitivoAtual.setDate(
      fimPeriodoAquisitivoAtual.getDate() + 365
    );

    if (fimPeriodoAquisitivoAtual > new Date()) {
      return (
        <Disclaimer message="Você não possui saldo de dias para solicitar férias." />
      );
    }

    if (
      historicoOrdenado.length &&
      periodoAquisitivoAtual.getFullYear() === new Date().getFullYear()
    ) {
      return (
        <Disclaimer message="Você já possui uma solicitação de férias para o período aquisitivo atual." />
      );
    }

    item.PeriodoAquisitivo = historicoOrdenado.length
      ? fimPeriodoAquisitivoAtual.toISOString()
      : colaborador.DataAdmissao;
  }

  const containerStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: "1rem",
  };

  const spacingStackTokens: IStackTokens = {
    childrenGap: 5,
  };

  const containerStackStyles: IStackStyles = {
    root: {
      minWidth: "max-content",
    },
  };

  return (
    <Stack horizontalAlign="center">
      <Stack tokens={containerStackTokens} styles={containerStackStyles}>
        <Stack>
          <Text
            variant="xLarge"
            styles={{
              root: {
                color: "rgb(0, 120, 212)",
              },
            }}
          >
            Solicitação de férias
          </Text>
        </Stack>
        <Stack>
          <TextField
            label="Solicitante"
            value={colaborador.Title}
            borderless
            readOnly
          />
        </Stack>
        <Stack tokens={spacingStackTokens} styles={containerStackStyles}>
          {formElement}
        </Stack>

        <Stack>
          <PeriodosFeriasList
            periodos={periodos}
            disableFields={!disableFields}
            minDate={minDate}
            options={periodosOptions}
            disabledDates={disabledDates}
            onChangePeriodo={setPeriodos}
          />
        </Stack>

        <Stack
          tokens={spacingStackTokens}
          style={{
            display: "none",
          }}
        />

        <Stack>
          <Label
            style={{
              color: "red",
            }}
          >
            {errors.length ? errors[0].message : ""}
          </Label>
        </Stack>

        <Stack horizontal tokens={spacingStackTokens}>
          <FormButtons
            onSend={onSend}
            onClose={onClose}
            onApproveManager={onApproveManager}
            onRejectManager={onRejectManager}
            onApproveHR={onApproveHR}
            onRejectHR={onRejectHR}
            onSaveHR={onSaveHR}
            displayMode={displayMode}
            isUserManager={isUserManager}
            isMemberOfHR={isMemberOfHR}
            isAuthor={isAuthor}
            status={formData.Status}
          />
        </Stack>

        <hr />

        <Stack>
          <SolicitacoesList items={historico} />
        </Stack>
      </Stack>
    </Stack>
  );
}
