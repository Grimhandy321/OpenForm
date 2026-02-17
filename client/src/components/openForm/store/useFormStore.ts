import { type UseFormReturnType } from "@mantine/form";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { IField, IFieldConfig, FormStep, FormGroup, Stepper, Message, Button, Tab } from "../types";

export interface TFormStore {
    steps: Record<string, FormStep>;
    setSteps: (steps: Record<string, FormStep>) => void;
    appendSteps: (steps: Record<string, FormStep>) => void;
    getStep: (stepId: string) => FormStep;
    updateStep: (stepId: string, step: FormStep) => void;

    groups: Record<string, FormGroup>;
    setGroups: (groups: Record<string, FormGroup>) => void;

    form: UseFormReturnType<Record<string, any>> | null;
    setForm: (form: UseFormReturnType<Record<string, any>>) => void;

    fields: Record<string, IField>;
    setFields: (fields: Record<string, IField>) => void;
    appendFields: (newFields: Record<string, IField>) => void;
    updateField: (fieldKey: string, updatedFieldPartial: Partial<IField>) => void;
    updateFieldConfig: (fieldKey: string, newConfig: Partial<IFieldConfig>) => void;
    getField: (fieldKey: string) => IField | undefined;

    stepper: Stepper | null;
    setStepper: (stepper: Stepper) => void;

    messages: Message[];
    setMessages: (messages: Message[]) => void;

    buttons: Button[];
    setButtons: (buttons: Button[]) => void;

    buttonErrors: Message[];
    setButtonErrors: (messages: Message[]) => void;

    alerts: Message[];
    setAlerts: (alerts: Message[]) => void;

    tabs: Record<string, Tab>;
    setTabs: (tabs: Record<string, Tab>) => void;
    getTab: (id: string) => Tab | null;
    setTabFields: (id: string, fields: Record<string, IField>) => void;

    csrfToken: string;
    setCsrfToken: (token: string) => void;
}

export const useFormStore: UseBoundStore<StoreApi<TFormStore>> = create<TFormStore>((set, get) => ({
    steps: {},
    setSteps: (steps) => set({ steps }),
    appendSteps: (steps) => set((state) => ({ steps: { ...state.steps, ...steps } })),
    getStep: (stepId) => get().steps[stepId],
    updateStep: (stepId, step) => set((state) => ({
        steps: { ...state.steps, [stepId]: { ...state.steps[stepId], ...step } },
    })),

    groups: {},
    setGroups: (groups) => set({ groups }),

    // Mantine form instance
    form: null,
    setForm: (form) => set({ form }),

    fields: {},
    setFields: (fields) => set({ fields }),
    appendFields: (newFields) => set((state) => ({ fields: { ...state.fields, ...newFields } })),
    updateField: (fieldKey, updatedFieldPartial) => set((state) => ({
        fields: { ...state.fields, [fieldKey]: { ...state.fields[fieldKey], ...updatedFieldPartial } },
    })),
    updateFieldConfig: (fieldKey, newConfig) => set((state) => ({
        fields: {
            ...state.fields,
            [fieldKey]: {
                ...state.fields[fieldKey],
                config: { ...state.fields[fieldKey]?.config, ...newConfig },
            },
        },
    })),
    getField: (fieldKey) => get().fields[fieldKey],

    stepper: null,
    setStepper: (stepper) => set({ stepper }),

    messages: [],
    setMessages: (messages) => set({ messages }),

    buttons: [],
    setButtons: (buttons) => set({ buttons }),

    buttonErrors: [],
    setButtonErrors: (buttonErrors) => set({ buttonErrors }),

    alerts: [],
    setAlerts: (alerts) => set({ alerts }),

    tabs: {},
    setTabs: (tabs) => set({ tabs }),
    getTab: (id) => get().tabs[id] ?? null,
    setTabFields: (id, fields) => set((state) => ({
        tabs: { ...state.tabs, [id]: { ...state.tabs[id], fields } },
    })),

    csrfToken: "",
    setCsrfToken: (token) => set({ csrfToken: token }),
}));
