import { Card, List, Stack, Text, Title } from "@mantine/core";
import type {FC} from "react";
import type {FieldComponentProps} from "../openForm/store/useComponentsStore.tsx";

export const ArchitectureStack:FC<FieldComponentProps>  = (_props: any) => {
    return (
        <Card shadow="sm" radius="md" withBorder>
            <Stack gap="sm">
                <Title order={4}>Architecture Overview</Title>
                <List spacing="xs" size="sm">
                    <List.Item>
                        <Text><b>Frontend:</b> React + TypeScript + Mantine</Text>
                    </List.Item>
                    <List.Item>
                        <Text><b>State:</b> Zustand</Text>
                    </List.Item>
                    <List.Item>
                        <Text><b>Rendering:</b> Schema-based field generator</Text>
                    </List.Item>
                    <List.Item>
                        <Text><b>Validation:</b> Laravel-style rules + custom validators</Text>
                    </List.Item>
                    <List.Item>
                        <Text><b>Backend:</b> PHP integration</Text>
                    </List.Item>
                </List>
            </Stack>
        </Card>
    );
};
