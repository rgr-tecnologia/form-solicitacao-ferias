import React from "react";

//UI components
import { TextField } from "@fluentui/react/lib/TextField";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { CreateFormFeriasProps } from "./CreateForm.props";
import { useQuantidadeDiasOptions } from "../../hooks/useQuantidadeDiasOptions";

const containerStackTokens: IStackTokens = {
  childrenGap: "1rem",
};

const spacingStackTokens: IStackTokens = {
  childrenGap: "1rem",
};

export default function CreateForm(
  props: CreateFormFeriasProps
): React.ReactElement<CreateFormFeriasProps> {
  const { formData, onChange, onChangeModalidade } = props;

  const QuantidadeDiasOptions = useQuantidadeDiasOptions();

  const selectedKey = QuantidadeDiasOptions.findIndex(
    (option) => option.text === formData.QtdDias
  );

  const dropdownQuantidadeDiasOptions: IDropdownOption[] = React.useMemo(() => {
    return QuantidadeDiasOptions.map((option, index) => ({
      key: index,
      text: option.text,
    }));
  }, [QuantidadeDiasOptions]);

  const onChangeObservacao = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    value?: string
  ): void => {
    onChange({ ...formData, Observacao: value });
  };

  const onChangeQtdDias = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IDropdownOption
  ): void => {
    const selectedOption = QuantidadeDiasOptions[option.key as number];
    onChange({ ...formData, QtdDias: selectedOption.text });
    onChangeModalidade(selectedOption.text);
  };

  let observacoesElement: JSX.Element;

  if (formData.Status === "Rejected by manager") {
    observacoesElement = (
      <>
        <TextField
          label="Observações gestor"
          value={formData.ObservacaoGestor}
          disabled={true}
          multiline
          rows={3}
        />
      </>
    );
  } else if (formData.Status === "Rejected by HR") {
    observacoesElement = (
      <>
        <TextField
          label="Observações RH"
          value={formData.ObservacaoRH}
          multiline
          disabled={true}
          rows={3}
        />
      </>
    );
  }

  return (
    <Stack tokens={containerStackTokens}>
      <Dropdown
        label="Opções de férias"
        options={dropdownQuantidadeDiasOptions}
        onChange={onChangeQtdDias}
        selectedKey={selectedKey}
      />

      <Stack tokens={spacingStackTokens}>
        <TextField
          label="Observações"
          value={formData.Observacao}
          onChange={onChangeObservacao}
          multiline
          rows={3}
        />
      </Stack>

      <Stack>{observacoesElement}</Stack>
    </Stack>
  );
}
