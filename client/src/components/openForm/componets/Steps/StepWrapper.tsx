import {
    Box,
    Container, type MantineSize,
    Paper
} from "@mantine/core";
import classes       from "../../style/InsuranceCreate.module.css";
import type {FC, ReactNode} from "react";

export namespace StepWrapper {
    export interface Props {
        children?: ReactNode
        size?: MantineSize | string;
        mt?: MantineSize | string;
    }
}

export const StepWrapper: FC<StepWrapper.Props> = ({children, size, mt}) => {
    return (
        <Container size={size ? size : "xl"} px={"xs"} py={"xs"} mt={mt ? mt : "lg"}>
            <Paper shadow={"xs"} radius={"md"} p={"sm"}  withBorder>
                <Box className={classes.boxStyleLightGrey}>
                    {children}
                </Box>
            </Paper>
        </Container>
    )
}
