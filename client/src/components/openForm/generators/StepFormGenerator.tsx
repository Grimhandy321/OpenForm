import {type FC, useState} from "react";
import {Stepper, Grid, Button, Group} from "@mantine/core";
import {useFormStore} from "../store/useFormStore.ts";
import {useTranslator} from "../hooks/translator.ts";
import { GenerateGroup} from "./FormGenerator.tsx";
import {formatErrorMessage, validateField} from "../validation/ruleValidation.ts";
import {StepWrapper} from "../componets/Steps/StepWrapper.tsx";

export const StepFromGenerator: FC<{ handleSubmit: (data: object) => any }> = ({handleSubmit}) => {
    const [active, setActive] = useState(0);
    const {tr} = useTranslator();
    const store = useFormStore();


    const nextStep = () => {
        let hasError = false;

        const groups = Object.entries(store.steps)[active][1];
        if (!groups) return;
        store.form.clearErrors();

        groups.forEach(([, groupKey]) => {
            const group = store.groups[groupKey];

            if (!group || group.state === "HIDDEN") return;
            const fields = Array.isArray(group.value)
                ? group.value
                : Object.values(group.value).flat();

            fields.forEach((field) => {
                const errors = validateField(field, store.form, store);

                if (errors?.length) {
                    hasError = true;
                    store.form.setFieldError(
                        field,
                        formatErrorMessage(field, errors[0])
                    );
                }

            });
        });

        if (!hasError && active < Object.keys(store.steps).length) {
            store.form.values.step = active; // helper for backend validation
            setActive((prev) => prev + 1);
        }
    };

    const previousStep = () => {
        setActive((prev) => Math.max(prev - 1, 0));
    };

    return (
        <>
            <Stepper active={active}>
                {Object.entries(store.steps).map(([key, step]) => (
                    <Stepper.Step
                        key={key}
                        label={tr(`${key}.label`)}
                        description={tr(`${key}.description`)}
                    >
                        <StepWrapper>
                            <Grid>
                                {step.map(( item) => (
                                    <GenerateGroup groupId={item}/>
                                    )
                                )}
                            </Grid>
                        </StepWrapper>
                    </Stepper.Step>
                ))}

                <Stepper.Completed>
                    <StepWrapper/>
                </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl" mb="md">
                {active !== 0 && (
                    <Button variant="default" onClick={previousStep}>
                        {tr("step.back")}
                    </Button>
                )}

                {active === Object.keys(store.steps).length ? (
                    <Button onClick={() => handleSubmit(store.form.getValues())}>
                        {tr("insurance.submit")}
                    </Button>
                ) : (
                    <Button onClick={nextStep}>
                        {tr("step.next")}
                    </Button>
                )}
            </Group>
        </>
    );
};
