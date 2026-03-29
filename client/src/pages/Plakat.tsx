import {type FormDefinition} from "../components/openForm/store/useFormStore";
import {FormGenerator} from "../components/openForm/generators/FormGenerator.tsx";
import {toPng} from "html-to-image";
import {useRef} from "react";
import {Container} from "@mantine/core";


const deffinition: FormDefinition = {
    fields: {
        featureCards: {
            state: "EDITABLE",
            type: "CUSTOM",
            component: "FeatureCards",
        },

        architectureStack: {
            state: "EDITABLE",
            type: "CUSTOM",
            component: "ArchitectureStack",
        },

        codePreview: {
            state: "EDITABLE",
            type: "CUSTOM",
            component: "CodePreview",
        },

        statsPanel: {
            state: "EDITABLE",
            type: "CUSTOM",
            component: "StatsPanel",
        },
        title: {
            state: "EDITABLE",
            type: "TEXT",
            value: "OpenForm – Dynamic Form Generator",
            info: "Schema-driven forms for React + PHP",
        },

        Description: {
            state: "EDITABLE",
            type: "TEXTAREA",
            value:
                "OpenForm is a schema-driven form generation library designed to simplify the creation of dynamic forms.\n\n" +
                "The project enables a unified way to define form structure, layout, validation rules, computed fields, and table-based data inputs.\n\n" +
                "The React frontend generates the UI automatically from a JSON configuration, while the backend can validate the same structure server-side.\n\n" +
                "This reduces code duplication, improves consistency, and makes forms easier to maintain, scale, and reuse across projects.",
            info: "Project summary shown on the poster",
            validators: ["required|string|min:20|max:1200"],
        },

        datum: {
            state: "EDITABLE",
            value: Date.now() / 1000,
            type: "DATE",
            info: "Current project date",
        },

        student: {
            state: "EDITABLE",
            value: "Michal Příhoda",
            type: "TEXT",
            validators: ["required|string|min:3|max:50"],
            info: "Author / student name",
        },

        class: {
            state: "EDITABLE",
            value: "C4A",
            type: "TEXT",
            validators: ["required|string|min:2|max:10"],
            info: "School class",
        },

        projectType: {
            state: "EDITABLE",
            type: "SELECT",
            value: "web",
            info: "Example of select input",
            config: {
                data: [
                    { value: "web", label: "Web Application" },
                    { value: "library", label: "Library / Framework" },
                    { value: "prototype", label: "Prototype" },
                    { value: "fullstack", label: "Fullstack Solution" },
                ],
            },
        },

        version: {
            state: "EDITABLE",
            type: "NUMBER",
            value: 1,
            info: "Example of number input",
            validators: ["required|numeric|min:1|max:10"],
            config: {
                min: 1,
                max: 10,
            },
        },

        isOpenSource: {
            state: "EDITABLE",
            type: "BOOLEAN",
            value: true,
            info: "Example of boolean / checkbox field",
        },

        features: {
            state: "EDITABLE",
            type: "TEXTAREA",
            value:
                "• Schema-driven form rendering\n" +
                "• Laravel-style validation rules\n" +
                "• Table generator\n" +
                "• Expressions and computed values\n" +
                "• Step forms\n" +
                "• Groups and tabs\n" +
                "• Custom components\n" +
                "• Zustand store integration\n" +
                "• Cascading selects\n" +
                "• Shared frontend/backend validation concept",
            info: "Main project features",
        },

        fieldCount: {
            state: "EDITABLE",
            type: "NUMBER",
            value: 12,
            info: "Example of read-only computed/stat field",
        },

        validationExample: {
            state: "EDITABLE",
            type: "TEXT",
            value: "",
            validators: ["required|string|min:5|max:20"],
            error: "Try entering less than 5 characters to test validation",
        },

        computedExample: {
            state: "EDITABLE",
            type: "TEXT",
            value: "Computed fields supported via expressions",
            expression: "student + ' - ' + class",
            info: "Example of expression-based field",
        },

        grades: {
            state: "EDITABLE",
            type: "TABLE",
            value: [
                { student: 1, grade: 2, class: 101 },
                { student: 2, grade: 1, class: 102 },
                { student: 3, grade: 3, class: 101 },
            ],
            info: "Example of editable table with select and number columns",
            config: {
                cols: [
                    {
                        type: "SELECT",
                        state: "EDITABLE",
                        id: "student",
                        data: [
                            { value: 1, label: "John Smith", data: { email: "john.smith@student.com" } },
                            { value: 2, label: "Emma Johnson", data: { email: "emma.johnson@student.com" } },
                            { value: 3, label: "Michael Brown", data: { email: "michael.brown@student.com" } },
                            { value: 4, label: "Sophia Davis", data: { email: "sophia.davis@student.com" } },
                        ],
                    },
                    {
                        type: "NUMBER",
                        state: "EDITABLE",
                        id: "grade",
                        min: 1,
                        max: 5,
                    },
                    {
                        type: "SELECT",
                        state: "EDITABLE",
                        id: "class",
                        data: [
                            { value: 101, label: "Mathematics", data: { teacher: "Mr. Anderson" } },
                            { value: 102, label: "English", data: { teacher: "Ms. Taylor" } },
                            { value: 103, label: "Physics", data: { teacher: "Dr. Wilson" } },
                            { value: 104, label: "Computer Science", data: { teacher: "Mr. Clark" } },
                        ],
                    },
                ],
            },
        },

        architecture: {
            state: "EDITABLE",
            type: "TEXTAREA",
            value:
                "Frontend: React + TypeScript + Mantine\n" +
                "State Management: Zustand\n" +
                "Validation: Laravel-style rules + custom validators\n" +
                "Backend Integration: PHP\n" +
                "Dynamic Logic: Expressions + Config-driven rendering",
            info: "Architecture overview",
        },

        notes: {
            state: "EDITABLE",
            type: "TEXTAREA",
            value:
                "This form acts as a live demo of the OpenForm engine itself.\n" +
                "Every visible field is rendered from the same schema structure used by the library.",
            info: "Poster/demo explanation",
        },
    },

    groups: {
        Header: {
            state: "EDITABLE",
            type: "GROUP",
            value: ["title","Description", "notes"],
            config: {
                title: "Project Info",
                colls: 9,
            },
        },

        Description: {
            state: "EDITABLE",
            type: "GROUP",
            value: [
                "features", "architecture"],
            config: {
                title: "Project Description",
                colls: 9,
            },
        },

        Student: {
            state: "EDITABLE",
            type: "GROUP",
            value: [["datum", "student", "class"], ["projectType", "version", "isOpenSource"]],
            config: {
                title: "Project Information",
                colls: 9,
            },
        },

        Validation: {
            state: "EDITABLE",
            type: "GROUP",
            value: [["validationExample", "computedExample", "fieldCount"]],
            config: {
                title: "Validation & Expressions",
                colls: 9,
            },
        },

        Grades: {
            state: "EDITABLE",
            type: "GROUP",
            value: ["grades"],
            config: {
                title: "Table Generator Demo",
                colls: 18,
            },
        },

        PosterShowcase: {
            state: "EDITABLE",
            type: "GROUP",
            value: [["statsPanel","featureCards","architectureStack"], ["codePreview"]],
            config: {
                title: "Custom Components Showcase",
                colls: 18,
            },
        },
    },

    buttons: [
        { id: "save", value: "Save", color: "blue" },
        { id: "submit", value: "Submit", color: "green" },
    ],
};

export const Plakat = () => {
    const formRef = useRef<HTMLDivElement>(null);


    const downloadFormAsPng = async () => {
        if (!formRef.current) return;

        const node = formRef.current;

        const width = 4976;
        const height = 7022;

        const dataUrl = await toPng(node, {
            width,
            height,
            cacheBust: true,
            pixelRatio: 1,
            style: {
                transform: `scale(${width / node.offsetWidth})`,
                transformOrigin: "top left",
                width: `${node.offsetWidth}px`,
                height: `${node.offsetHeight}px`,
            },
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "form.png";
        link.click();
    };


    const handleSubmit = (data: object, action?: string) => {
        if (action === "save") {
            console.log("Saving draft", data);
        } else {
            console.log("Submitting", data);
        }
    };

    return (
        <div style={{padding: 20}}>
            {/* The ref wraps the form you want to export */}
            <div >
                <Container size={"75%"}>
                    <div ref={formRef}>
                <FormGenerator  definition={deffinition} handleSubmit={handleSubmit}/>
                    </div>
                </Container>
            </div>

            <div style={{marginTop: 16}}>
                <button onClick={downloadFormAsPng} style={{marginRight: 8}}>
                    Download Form as PNG
                </button>
            </div>
        </div>
    );

}
