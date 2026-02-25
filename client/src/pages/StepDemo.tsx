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
        {id: "save", value: "Save", color: "green"}
    ],

    fields: {
        // 🚘 STEP 1 — VEHICLE
        brand: {
            state: "EDITABLE",
            type: "SELECT",
            validators: ["required"],
            config: {
                data: [
                    {
                        value: 1,
                        label: "BMW"
                    },
                    {
                        value: 2,
                        label: "VW"
                    },
                    {
                        value: 3,
                        label: "SKODA"
                    }

                ],
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
                data: [{
                    value: 1,
                    label: "engine 1"
                }, {
                    value: 2,
                    label: "engine 2"
                }],
                loadData: ["model"]
            }
        },

        fuelType: {
            state: "EDITABLE",
            type: "SELECT",
            validators: ["required", "in:petrol,diesel,electric,hybrid"],
            config: {
                data: [
                    {value: "petrol", label: "Petrol"},
                    {value: "diesel", label: "Diesel"},
                    {value: "electric", label: "Electric"},
                    {value: "hybrid", label: "Hybrid"}
                ]
            }
        },

        transmission: {
            state: "EDITABLE",
            type: "SELECT",
            validators: ["required", "in:manual,automatic"],
            config: {
                data: [
                    {value: "manual", label: "Manual"},
                    {value: "automatic", label: "Automatic"}
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
            config: {
                max: 17
            },
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
            validators: ["required", "string", "min:2", "max:60"]
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
            config: {title: "Vehicle Selection"}
        },

        specsGroup: {
            type: "TABS",
            value: {
                engineData: ["engine", "horsepower", "fuelType", "transmission"],
                vehicleId: ["vin"]
            },
            config: {title: "Vehicle Specifications"}
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
            config: {title: "Owner Information"}
        }
    }
};


// ====================== Demo loader ======================
export const demoLoader = async ({target, source, value}: { target: string, source: string, value: any }) => {

    console.debug(target, source, value);
    // simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // return mock data depending on the source and selected value
    if (source === "brand") {
        if (value === 1) return [
            {value: 101, label: "BMW 3 Series"},
            {value: 102, label: "BMW 5 Series"},
        ];
        if (value === 2) return [
            {value: 201, label: "VW Golf"},
            {value: 202, label: "VW Passat"},
        ];
        if (value === 3) return [
            {value: 301, label: "Skoda Octavia"},
            {value: 302, label: "Skoda Superb"},
        ];
    }

    if (source === "model") {
        if (value === 101) return [
            {value: 1001, label: "320i"},
            {value: 1002, label: "330i"},
        ];
        if (value === 102) return [
            {value: 1003, label: "520i"},
            {value: 1004, label: "530i"},
        ];
        if (value === 201) return [
            {value: 2001, label: "Golf 1.4"},
            {value: 2002, label: "Golf 2.0"},
        ];
        if (value === 202) return [
            {value: 2003, label: "Passat 1.4"},
            {value: 2004, label: "Passat 2.0"},
        ];
        if (value === 301) return [
            {value: 3001, label: "Octavia Ambition"},
            {value: 3002, label: "Octavia Style"},
        ];
        if (value === 302) return [
            {value: 3003, label: "Superb Ambition"},
            {value: 3004, label: "Superb Style"},
        ];
    }

    // fallback empty array
    return [];
};


export const StepDemo = () => {
    const handleSubmit = (data: object, action?: string) => {
        if (action === "save") {
            console.log("Saving draft", data);
        } else {
            console.log("Submitting", data);
        }
    };


    return <Container size={"xl"}>
        <FormGenerator definition={carFormDefinition} cascadeLoderFn={demoLoader} handleSubmit={handleSubmit}/>
    </Container>;
}
