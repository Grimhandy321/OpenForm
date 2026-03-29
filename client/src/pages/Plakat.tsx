import {type FormDefinition} from "../components/openForm/store/useFormStore";
import {FormGenerator} from "../components/openForm/generators/FormGenerator.tsx";
import {toPng} from "html-to-image";
import {useRef} from "react";


const deffinition: FormDefinition = {
    "fields": {
        "Abstrakt": {
            state: "EDITABLE",
            type: "TEXTAREA",
            value: "OpenForm – systém pro automatickou generaci a validaci webových formulářů\n" +
                "Projekt umožňuje jednotně definovat strukturu formulářů a validační pravidla.\n" +
                "Frontend v Reactu generuje formuláře z JSON konfigurace, backend v PHP zajišťuje serverovou validaci.\n" +
                "Výsledkem je funkční prototyp používatelný na obou stranách aplikace.\n" +
                "Řešení zjednodušuje vývoj, snižuje duplicitu kódu a zajišťuje konzistentní práci s formuláři. \n"
        },
    },
    "groups": {
        "Abstrakt": {
            "state": "EDITABLE",
            "type": "GROUP",
            "value": ["Abstrakt"],
            "config": {
                "title": "Abstrakt",
                "colls": 8
            }
        },
    },
    "buttons": [
        {"id": "save", "value": "Save", "color": "blue"},
        {"id": "submit", "value": "Submit", "color": "green"}
    ],
}


export const Plakat = () => {
    const formRef = useRef<HTMLDivElement>(null);

    const downloadFormAsPng = async () => {
        if (!formRef.current) return;

        try {
            // Wait for fonts to load (important for text rendering)
            await document.fonts.ready;

            const dataUrl = await toPng(formRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#ffffff", // set white background
            });

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "form.png";
            link.click();
        } catch (error) {
            console.error("Failed to export form:", error);
        }
    };


    const handleSubmit = (data: object, action?: string) => {
        if (action === "save") {
            console.log("Saving draft", data);
        } else {
            console.log("Submitting", data);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            {/* The ref wraps the form you want to export */}
            <div ref={formRef}>
                <FormGenerator definition={deffinition} handleSubmit={handleSubmit} />
            </div>

            <div style={{ marginTop: 16 }}>
                <button onClick={downloadFormAsPng} style={{ marginRight: 8 }}>
                    Download Form as PNG
                </button>
            </div>
        </div>
    );

}
