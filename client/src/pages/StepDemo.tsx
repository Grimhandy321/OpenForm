import {Container} from "@mantine/core";
import {FormGenerator} from "../components/openForm/generators/FormGenerator.tsx";
import type {FormDefinition} from "../components/openForm/store/useFormStore.ts";

export const carFormDefinition: FormDefinition = {
    steps: {
        vehicle: ["vehicleGroup"],
        specs: ["specsGroup"],
        owner: ["ownerGroup"]
    },

    buttons: [
        { id: "save", value: "Save", color: "green" }
    ],

    fields: {
        // 🚘 STEP 1 — VEHICLE
        brand: {
            state: "EDITABLE",
            type: "SELECT",
            validators: ["required"],
            config: {
                data: [],
                loadData: ["model"]
            }
        },

        model: {
            state: "EDITABLE",
            type: "SELECT",
            validators: ["required"],
            config: {
                data: [],
                loadData: ["trim"]
            }
        },

        trim: {
            state: "EDITABLE",
            type: "SELECT",
            validators: ["required"],
            config: {
                data: [],
                loadData: []
            }
        },

        // ⚙️ STEP 2 — SPECS
        engine: {
            state: "EDITABLE",
            type: "SELECT",
            validators: [
                "required_if:fuelType,petrol",
                "required_if:fuelType,diesel"
            ],
            config: {
                data: [],
                loadData: ["model"]
            }
        },

        fuelType: {
            state: "EDITABLE",
            type: "SELECT",
            validators: ["required", "in:petrol,diesel,electric,hybrid"],
            config: {
                data: [
                    { value: "petrol", label: "Petrol" },
                    { value: "diesel", label: "Diesel" },
                    { value: "electric", label: "Electric" },
                    { value: "hybrid", label: "Hybrid" }
                ]
            }
        },

        transmission: {
            state: "EDITABLE",
            type: "SELECT",
            validators: ["required", "in:manual,automatic"],
            config: {
                data: [
                    { value: "manual", label: "Manual" },
                    { value: "automatic", label: "Automatic" }
                ]
            }
        },

        horsepower: {
            state: "EDITABLE",
            type: "NUMBER",
            validators: ["required", "numeric", "between:40,1500"]
        },

        vin: {
            state: "EDITABLE",
            type: "STRING",
            info: "Vehicle Identification Number",
            validators: [
                "required",
                "size:17",
                "regex:/^[A-HJ-NPR-Z0-9]+$/"
            ]
        },

        // 👤 STEP 3 — OWNER
        ownerName: {
            state: "EDITABLE",
            type: "STRING",
            validators: ["required", "min:2", "max:60"]
        },

        ownerEmail: {
            state: "EDITABLE",
            type: "STRING",
            validators: ["required", "email"]
        },

        confirmEmail: {
            state: "EDITABLE",
            type: "STRING",
            validators: ["required", "same:ownerEmail"]
        },

        phone: {
            state: "EDITABLE",
            type: "STRING",
            validators: [
                "nullable",
                "regex:/^\\+?[0-9]{9,15}$/"
            ]
        },

        registrationDate: {
            state: "EDITABLE",
            type: "DATE",
            validators: ["required"]
        },

        termsAccepted: {
            state: "EDITABLE",
            type: "BOOLEAN",
            validators: ["required"]
        }
    },

    groups: {
        vehicleGroup: {
            type: "GROUP",
            value: ["brand", "model", "trim"],
            config: { title: "Vehicle Selection" }
        },

        specsGroup: {
            type: "GROUP",
            value: {
                engineData: ["engine", "horsepower", "fuelType", "transmission"],
                vehicleId: ["vin"]
            },
            config: { title: "Vehicle Specifications" }
        },

        ownerGroup: {
            type: "GROUP",
            value: [
                "ownerName",
                "ownerEmail",
                "confirmEmail",
                "phone",
                "registrationDate",
                "termsAccepted"
            ],
            config: { title: "Owner Information" }
        }
    }
};

export const StepDemo = () => {
    const handleSubmit = (data: object, action?: string) => {
        if (action === "save") {
            console.log("Saving draft", data);
        } else {
            console.log("Submitting", data);
        }
    };
    return <Container size={"xl"} bg ='dark' >
        <FormGenerator definition={carFormDefinition} handleSubmit={handleSubmit} />
    </Container>;
}
