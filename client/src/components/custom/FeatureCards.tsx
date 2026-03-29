import { Card, Group, Stack, Text, Title, Badge } from "@mantine/core";
import type {FC} from "react";
import type {FieldComponentProps} from "../openForm/store/useComponentsStore.tsx";

const features = [
    {
        title: "Schema Driven",
        desc: "Forms are generated automatically from JSON definitions.",
        badge: "Core",
    },
    {
        title: "Validation",
        desc: "Supports Laravel-style validators and custom validation logic.",
        badge: "Rules",
    },
    {
        title: "Tables",
        desc: "Editable tables with computed columns and structured configs.",
        badge: "Advanced",
    },
    {
        title: "Extensible",
        desc: "Custom React components can be rendered as form fields.",
        badge: "Custom",
    },
];

export const FeatureCards: FC<FieldComponentProps> = (_props: any) => {
    return (
        <Stack gap="md">
            <Title order={4}>Key Features</Title>
            <Group grow align="stretch">
                {features.map((feature) => (
                    <Card key={feature.title} shadow="sm" radius="md" withBorder>
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text fw={700}>{feature.title}</Text>
                                <Badge>{feature.badge}</Badge>
                            </Group>
                            <Text size="sm" c="dimmed">
                                {feature.desc}
                            </Text>
                        </Stack>
                    </Card>
                ))}
            </Group>
        </Stack>
    );
};
