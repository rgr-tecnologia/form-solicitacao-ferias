import * as React from "react";

import {
  Stack,
  IStackTokens,
  TextField,
  Dropdown,
  IDropdownOption,
} from "office-ui-fabric-react";
import { ViewFormSolicitacaoFeriasProps } from "./ViewForm.props";
import { useQuantidadeDiasOptions } from "../../hooks/useQuantidadeDiasOptions";
import { CreateSolicitacaoFerias } from "../../types/SolicitacaoFerias";

export default function ViewForm(
  props: ViewFormSolicitacaoFeriasProps
): React.ReactElement<ViewFormSolicitacaoFeriasProps> {
  const {
    formData: initialData,
    onChange,
    onChangeModalidade,
    isUserManager,
    isMemberOfHR,
  } = props;

  const [formData, setFormData] =
    React.useState<CreateSolicitacaoFerias>(initialData);

  const QuantidadeDiasOptions = useQuantidadeDiasOptions();

  const dropdownQuantidadeDiasOptions: IDropdownOption[] = React.useMemo(() => {
    return QuantidadeDiasOptions.map((option, index) => ({
      key: index,
      text: option.text,
    }));
  }, [QuantidadeDiasOptions]);

  const selectedKey = QuantidadeDiasOptions.findIndex(
    (option) => option.text === formData.QtdDias
  );

  const containerStackTokens: IStackTokens = { childrenGap: 5 };

  const spacingStackTokens: IStackTokens = {
    childrenGap: "1.5rem",
  };

  const onChangeQtdDias = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IDropdownOption
  ): void => {
    const selectedOption = QuantidadeDiasOptions[option.key as number];
    setFormData((prevData) => ({ ...prevData, QtdDias: selectedOption.text }));
    onChange({ ...formData, QtdDias: selectedOption.text });
    onChangeModalidade(selectedOption.text);
  };

  const onChangeObservacaoRH = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    value?: string
  ): void => {
    setFormData((prevData) => ({ ...prevData, ObservacaoRH: value }));
    onChange({ ...formData, ObservacaoRH: value });
  };

  const onChangeObservacoesGestor = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    value?: string
  ): void => {
    setFormData((prevData) => ({ ...prevData, ObservacaoGestor: value }));
    onChange({ ...formData, ObservacaoGestor: value });
  };

  let observacoesElement: JSX.Element;

  if (isUserManager && formData.Status === "In review by manager") {
    observacoesElement = (
      <>
        <TextField
          label="Observações gestor"
          value={formData.ObservacaoGestor}
          onChange={onChangeObservacoesGestor}
          multiline
          rows={3}
        />
      </>
    );
  } else if (isMemberOfHR && formData.Status === "In review by HR") {
    observacoesElement = (
      <>
        <TextField
          label="Observações gestor"
          value={formData.ObservacaoGestor}
          onChange={onChangeObservacoesGestor}
          disabled={true}
          multiline
          rows={3}
        />
        <TextField
          label="Observações RH"
          value={formData.ObservacaoRH}
          onChange={onChangeObservacaoRH}
          multiline
          rows={3}
        />
      </>
    );
  }

  let opcoesFeriasElement: JSX.Element;

  if (
    (isMemberOfHR && formData.Status === "Approved by HR") ||
    formData.Status === "Edited by HR"
  ) {
    opcoesFeriasElement = (
      <>
        <Dropdown
          label="Opções de férias"
          options={dropdownQuantidadeDiasOptions}
          onChange={onChangeQtdDias}
          selectedKey={selectedKey}
        />
      </>
    );
  } else {
    opcoesFeriasElement = (
      <>
        <Dropdown
          label="Opções de férias"
          options={dropdownQuantidadeDiasOptions}
          selectedKey={selectedKey}
          disabled={true}
        />
      </>
    );
  }

  return (
    <Stack tokens={containerStackTokens}>
      <Stack>{opcoesFeriasElement}</Stack>
      <Stack>
        <TextField
          label="Observações"
          value={formData.Observacao}
          onChange={onChangeObservacaoRH}
          disabled={true}
          multiline
          rows={3}
        />
      </Stack>

      <Stack tokens={spacingStackTokens}>{observacoesElement}</Stack>
    </Stack>
  );
}
