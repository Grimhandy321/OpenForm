import { Card, Code, ScrollArea, Stack, Text, Title } from "@mantine/core";
import type {FC} from "react";
import type {FieldComponentProps} from "../openForm/store/useComponentsStore.tsx";

const demoCode = `{
  "student": {
    "type": "TEXT",
    "value": "Michal Příhoda"
  },
  "grades": {
    "type": "TABLE",
    "config": {
      "cols": [
        { "id": "student", "type": "SELECT" },
        { "id": "grade", "type": "NUMBER" },
        { "id": "class", "type": "SELECT" }
      ]
    }
  }
}`;

export const CodePreview:FC<FieldComponentProps>  = (_props: any) => {
    return (
        <Card shadow="sm" radius="md"  withBorder>
            <Stack gap="sm">
                <Title order={4}>Schema Example</Title>
                <Text size="sm" c="dimmed">
                    OpenForm generates the UI from structured JSON configuration.
                </Text>
                <ScrollArea h={515}>
                    <Code block>{demoCode}</Code>
                </ScrollArea>
            </Stack>
        </Card>
    );
};
