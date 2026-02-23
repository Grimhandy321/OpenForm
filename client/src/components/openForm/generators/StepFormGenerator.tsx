import {type FC, useState} from "react";
import {Stepper, Grid, Group, Button} from "@mantine/core";
import {useFormStore} from "../store/useFormStore.ts";
import {useTranslator} from "../hooks/translator.ts";
import {GenerateField, GenerateGroup} from "./FormGenerator.tsx";
import {formatErrorMessage, validateField} from "../validation/ruleValidation.ts";
import {StepWrapper} from "../componets/Steps/StepWrapper.tsx";

export const StepFromGenerator: FC<{handleSubmit: (data: object) => any}> = ({handleSubmit}) => {
    const [active, setActive] = useState(0);
    const {tr} = useTranslator();
    const store = useFormStore();

    const nextStep = () => {
        let hasError = false
        if (!Object.entries(store.steps)[active][1]) {
            return;
        }
        store.form.clearErrors();
        const step = Object.entries(store.steps)[active][1];
        Object.entries(step).map(([_key, _value]) => {
            if (typeof _value === "string") {
                const errors = validateField(_value, store.form, store);
                console.log(errors);
                if (errors.length > 0) {
                    hasError = true;
                    store.form.setFieldError(_value, formatErrorMessage(_value,errors[0]));
                }
            } else {
                if (_value.state == "HIDDEN") {
                    return;
                }
                _value.value?.forEach((value) => {
                    const errors = validateField(value, store.form, store);
                    if (errors?.length > 0) {
                        console.log(errors);
                        hasError = true;
                        store.form.setFieldError(value,  formatErrorMessage(value,errors[0]));
                    }
                })
            }
        })
        if (!hasError) {
            store.form.values.step = active; // helper for partial backed validation
            return setActive((current) => (current < Object.keys(store.steps).length ? current + 1 : current));
        }
        return setActive((current) => (current < Object.keys(store.steps).length ? current : current));
    }
    const previousStep = (): void => {
        return setActive((current) => (current > 0 ? current - 1 : current));
    }

    return (
        <>
            <Stepper active={active} >
                {
                    Object.keys(store.steps).map((key) => {
                        const step = store.steps[key];
                        return (
                            <Stepper.Step
                                key={key}
                                label={tr(key + ".label")}
                                description={tr(key + ".description")}
                            >
                                <StepWrapper key={key}>
                                    <Grid>
                                        {Object.keys(step).map((key) => {
                                            // @ts-ignore
                                            const item = step[key];
                                            if (typeof item === "string") {
                                                return <Grid.Col key={key} span={6}> <GenerateField key={key}
                                                                                                    fieldId={item}/></Grid.Col>
                                            } else {
                                                return <GenerateGroup key={key} group={item}/>
                                            }
                                        })}
                                    </Grid>
                                </StepWrapper>
                            </Stepper.Step>
                        )
                    })}
                <Stepper.Completed>
                    <StepWrapper>

                    </StepWrapper>

                </Stepper.Completed>
            </Stepper>
            <Group justify={"center"} mt={"xl"} mb={"md"}>
                {active !== 0 &&
                    <Button
                        variant="default"
                        onClick={previousStep}
                    >
                        {tr("step.back")}
                    </Button>
                }
                {active === Object.keys(store.steps).length ? (
                    <Button onClick={handleSubmit(store.form.getValues())}>
                        {tr("insurance.submit")}
                    </Button>
                ) : (
                    <Button
                        onClick={() => nextStep()}
                        disabled={active === Object.keys(store.steps).length}
                    >
                        {tr("step.next")}
                    </Button>
                )}

            </Group>
        </>
    );
}
