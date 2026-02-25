import {type FC, useState} from "react";
import {Stepper, Grid, Button, Group} from "@mantine/core";
import {useFormStore} from "../store/useFormStore.ts";
import {useTranslator} from "../hooks/translator.ts";
import { GenerateGroup} from "./FormGenerator.tsx";
import {formatErrorMessage, validateField} from "../validation/ruleValidation.ts";
import {StepWrapper} from "../componets/Steps/StepWrapper.tsx";
import {useForm} from "@mantine/form";

export const StepFromGenerator: FC<{ handleSubmit: (data: object) => any;form: ReturnType<typeof useForm>  }> = ({handleSubmit,form}) => {
    const [active, setActive] = useState(0);
    const {tr} = useTranslator();
    const store = useFormStore();


    const nextStep = () => {
        let hasError = false;

        const groups = Object.entries(store.steps)[active][1];
        if (!groups) return;
        form.clearErrors();
        groups.forEach((groupKey) => {
            const group = store.groups[groupKey];
            if (!group || group.state === "HIDDEN") return;
            const fields = Array.isArray(group.value)
                ? group.value
                : Object.values(group.value).flat();

            fields.forEach((field) => {
                const errors = validateField(field,form, store);

                if (errors?.length) {
                    hasError = true;
                   form.setFieldError(
                        field,
                        formatErrorMessage(field, errors[0])
                    );
                }

            });
        });

        if (!hasError && active < Object.keys(store.steps).length) {
            form.values.step = active; // helper for validation
            setActive((prev) => prev + 1);
        }
    };

    const previousStep = () => {
        setActive((prev) => Math.max(prev - 1, 0));
    };

    const steps = Object.entries(store.steps);
    const lastIndex = steps.length - 1;

    return (
        <>
            <Stepper active={active}>
                {steps.slice(0, lastIndex).map(([key, step]) => (
                    <Stepper.Step
                        key={key}
                        label={tr(`${key}.label`)}
                        description={tr(`${key}.description`)}
                    >
                        <StepWrapper>
                            <Grid>
                                {step.map((item, index) => (
                                    <GenerateGroup key={index} groupId={item} form={form} />
                                ))}
                            </Grid>
                        </StepWrapper>
                    </Stepper.Step>
                ))}

                <Stepper.Completed>
                    <StepWrapper>
                        <Grid>
                            {steps[lastIndex][1].map((item: string, index: number) => (
                                <GenerateGroup key={index} groupId={item} form={form} />
                            ))}
                        </Grid>
                    </StepWrapper>
                </Stepper.Completed>
            </Stepper>
            <Group justify="center" mt="xl" mb="md">
                {active !== 0 && (
                    <Button variant="default" onClick={previousStep}>
                        {tr("step.back")}
                    </Button>
                )}

                {active === Object.keys(store.steps).length ? (
                    <Button onClick={() => handleSubmit(form.getValues())}>
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
