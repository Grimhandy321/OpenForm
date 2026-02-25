import {type FormDefinition} from "../components/openForm/store/useFormStore";
import {FormGenerator} from "../components/openForm/generators/FormGenerator.tsx";
import {Container} from "@mantine/core";


const deffinition: FormDefinition = {
    "fields": {
        "csrf_token": {
            "state": "HIDDEN",
            "value": "demo_csrf_token_123456",
            "type": "STRING"
        },
        "number": {
            "state": "VIEW",
            "value": "EWC-DEMO-001",
            "type": "STRING"
        },
        "policyNumber": {
            "state": "VIEW",
            "value": "POL-2026-0001",
            "type": "STRING"
        },
        "plate": {
            "state": "EDITABLE",
            "value": "9AB1234",
            "type": "STRING"
        },
        "registeredDate": {
            "state": "VIEW",
            "value": 1700000000,
            "type": "DATE"
        },
        "noticedDate": {
            "state": "EDITABLE",
            "value": 1700500000,
            "type": "DATE",
            "config": {
                "min": 1690000000,
                "max": 1750000000
            }
        },
        "complaints": {
            "state": "EDITABLE",
            "value": "Rear trunk does not close properly.",
            "type": "TEXTAREA"
        },
        "runKm": {
            "state": "VIEW",
            "value": 45231,
            "type": "NUMBER"
        },
        "currency": {
            "state": "VIEW",
            "value": "EUR",
            "type": "STRING"
        },
        "vat": {
            "state": "EDITABLE",
            "value": 21,
            "type": "NUMBER"
        },
        "Parts": {
            "state": "EDITABLE",
            "value": [
                {
                    "description": "Power trunk strut",
                    "price": 120,
                    "quantity": 1,
                    "discount": 0
                }
            ],
            "type": "TABLE",
            "config": {
                "limit": 5,
                "cols": [
                    {"type": "TEXT", "state": "EDITABLE", "id": "description"},
                    {"type": "NUMBER", "state": "EDITABLE", "id": "price", "min": 0},
                    {"type": "NUMBER", "state": "EDITABLE", "id": "quantity", "min": 1, "default": 1},
                    {
                        "type": "NUMBER",
                        "state": "VIEWONLY",
                        "id": "totalCost",
                        "expression": "Number(data.quantity) * Number(data.price)",
                        "aggregate": true
                    }
                ]
            }
        },
        "Files": {
            "state": "EDITABLE",
            "value": [],
            "type": "TABLE",
            "config": {
                "cols": [
                    {"type": "FILE", "state": "EDITABLE", "id": "name"},
                    {"type": "TEXT", "state": "EDITABLE", "id": "description"}
                ]
            }
        }
    },

    "groups": {
        "incident": {
            "state": "EDITABLE",
            "type": "GROUP",
            "value": ["number", "policyNumber", "plate"],
            "config": {
                "title": "Incident Info",
                "colls": 6
            }
        },
        "dates": {
            "state": "EDITABLE",
            "type": "GROUP",
            "value": ["registeredDate", "noticedDate", "runKm"],
            "config": {
                "title": "Dates & Mileage",
                "colls": 6
            }
        },
        "costs": {
            "state": "EDITABLE",
            "type": "GROUP",
            "value": ["currency", "vat"],
            "config": {
                "title": "Costs",
                "colls": 6
            }
        },
        "parts": {
            "state": "EDITABLE",
            "type": "GROUP",
            "value": ["claimParts"],
            "config": {
                "title": "Parts",
                "colls": 12
            }
        },
        "files": {
            "state": "EDITABLE",
            "type": "GROUP",
            "value": ["claimFiles"],
            "config": {
                "title": "Attachments",
                "colls": 12
            }
        },
        "comments": {
            "state": "EDITABLE",
            "type": "GROUP",
            "value": ["complaints"],
            "config": {
                "title": "Comments",
                "colls": 12
            }
        }
    },
    "buttons": [
        {"id": "save", "value": "Save", "color": "blue"},
        {"id": "submit", "value": "Submit", "color": "green"}
    ],
}


export const BasicDemo = () => {
    const handleSubmit = (data: object, action?: string) => {
        if (action === "save") {
            console.log("Saving draft", data);
        } else {
            console.log("Submitting", data);
        }
    };
    return <Container size={"xl"} bg ='dark' >
        <FormGenerator definition={deffinition} handleSubmit={handleSubmit} />
    </Container>;
}
