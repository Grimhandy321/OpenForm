import { Grid, Box, Container, Paper, Text, Collapse, Group } from "@mantine/core";
import React, {type FC, type ReactNode } from "react";
import classes from "../../style/Claim.module.css";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronLeft } from "@tabler/icons-react";

export namespace FormInputElementWraper {
    export interface Props {
        children?: ReactNode;
        title?: React.ReactNode; // accept any React node
        disabled?: boolean;
        size?: string;
        disableVisibilityCheck?: boolean;
        colls?: number;
        collabsable?: boolean;
        className?: string;
    }
}

export const FormInputElementWraper: FC<FormInputElementWraper.Props> = ({
                                                                             size,
                                                                             children,
                                                                             title,
                                                                             disableVisibilityCheck = false,
                                                                             collabsable = false,
                                                                             colls,
                                                                             className,
                                                                         }) => {
    const childrenArray = React.Children.toArray(children);
    let allInvisible = true;

    childrenArray.forEach((child) => {
        if (React.isValidElement(child)) {
            // @ts-ignore
            const style = child?.props?.style as any;
            if (style?.display !== 'none' && style?.visibility !== 'hidden' && style?.opacity !== '0') {
                allInvisible = false;
            }
        }
    });

    if (allInvisible && !disableVisibilityCheck) {
        return (<></>);
    }

    const [opened, { toggle }] = useDisclosure(true);

    return (
        <Grid.Col span={{ base: 12, sm: colls ? colls : 6 }}>
            <Container px={"0.3em"} mx={"0px"} size={size ? size : "1000rem"}>
                <Paper my={"xs"} shadow={"xs"} withBorder>
                    <Group justify="space-between" gap="sm"   className={`${classes.formWraperBoxTitle} ${className || ""}`} >
                        <Text>{title}</Text>
                        {collabsable && (
                            <>
                                {opened ? <IconChevronDown onClick={toggle} /> : <IconChevronLeft onClick={toggle} />}
                            </>
                        )}
                    </Group>

                    <Collapse in={opened}>
                        <Box className={classes.formWraperBox} >
                            {children}
                        </Box>
                    </Collapse>
                </Paper>
            </Container>
        </Grid.Col>
    );
};
