import * as React from "react";
import { Stack, Text } from "office-ui-fabric-react";

type DisclaimerProps = {
  message: string;
};

export function Disclaimer(props: DisclaimerProps): JSX.Element {
  return (
    <Stack
      styles={{
        root: {
          alignItems: "center",
        },
      }}
    >
      <Text style={{ color: "red", fontWeight: "bold" }}>
        {" "}
        {props.message}{" "}
      </Text>
    </Stack>
  );
}
