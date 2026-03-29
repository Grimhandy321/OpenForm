import { Card, Group, Stack, Text, Title } from "@mantine/core";
import type {FC} from "react";
import type {FieldComponentProps} from "../openForm/store/useComponentsStore.tsx";

const stats = [
    { label: "Field Types", value: "8+" },
    { label: "Validation Rules", value: "12+" },
    { label: "Table Support", value: "Yes" },
    { label: "Custom Components", value: "Yes" },
];

export const StatsPanel:FC<FieldComponentProps> = (_props: any) => {
    return (
        <Stack gap="md">
            <Title order={4}>Project Highlights</Title>
            <Group grow>
                {stats.map((stat) => (
                    <Card key={stat.label} shadow="sm" radius="md" withBorder>
                        <Stack gap={4} align="center">
                            <Text size="xl" fw={800}>
                                {stat.value}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {stat.label}
                            </Text>
                        </Stack>
                    </Card>
                ))}
            </Group>
        </Stack>
    );
};
