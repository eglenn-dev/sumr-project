import React, { useState, useMemo } from "react";
import InputNotes from "./components/InputNotes";
import DischargeSummary from "./components/DischargeSummary";
import ThreeDModelViewer from "./components/ThreeDModelViewer";
import {
    extractOrganHighlightsFromText,
    type OrganHighlight,
    mappings as allMedicalMappings,
} from "./lib/medicalMapping";

// Escapes special characters for use in regex patterns
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Example input text and summary points
const inputFullText: string = `Attending:First Name (LF) 301
Chief Complaint:
Abdominal pain
Major Surgical or Invasive Procedure:
Exploratory laparotomy, right nephrectomy
History of Present Illness:
Mr Known lastname 65533 is a Age over 90 year old man s/p right nephrectomy, s/p left
ureterostomy ileal conduit who was transferred from Hospital1 18
Location (un) 620 for sharp and worsening abdominal pain. The patient
denied any bowel movement in the 2-3 days prior to presentation
but had some flatus in the previous hour. A CT scan performed at
Location (un) 620 was concerning for large bowel obstruction/cecal
volvulus. He also reported symptoms of respiratory distress.
Past Medical History:
PMH: CAD, MI, HTN, DJD, renal CA, a-fib
PSH: CCY, R nephrectomy, cystectomy/ileal conduit, AAA,
pacemaker, PTCA. He also had a history of necrotic gut requiring intervention.
Social History:
No tobacco, occasional wine. Other underlying conditions were noted.
Family History:
Non-contributory
Physical Exam:
Temp 97.2 72 170/76 24
Gen: sitting up
Post-operative course included complications such as coagulopathy, hypoglycemia, and respiratory distress requiring intubation and readmission to the SICU.
Patient eventually recovered and was discharged to an extended care facility for rehabilitation.
Discharge medications included pain medications, anticoagulants.
Follow-up instructions included wound care, activity restrictions, and close follow-up with his surgeon.
Revision of ileal conduit was also performed.
`;

const dischargeSummaryPointsFromImage: string[] = [
    "Patient, a Age over 90 year old man, presented with sharp and worsening abdominal pain and no bowel movement for 2-3 days.",
    "CT scan showed large bowel obstruction/cecal volvulus.",
    "Underwent exploratory laparotomy, right colectomy, and revision of ileal conduit on 2122-2-13.",
    "Intraoperatively, patient was found to have necrotic gut and underwent right colectomy.",
    "Postoperatively, patient had several complications, including coagulopathy, hypoglycemia, and respiratory distress, requiring intubation and readmission to the SICU.",
    "Patient eventually recovered and was discharged to an extended care facility for rehabilitation on 2122-3-3.",
    "Discharge medications included pain medications, anticoagulants, and other medications to manage his underlying conditions.",
    "Follow-up instructions included wound care, activity restrictions, and close follow-up with his surgeon.",
];

const App: React.FC = () => {
    const [textToHighlightInInput, setTextToHighlightInInput] = useState<
        string | null
    >(null);

    // Extracts organ highlights for the 3D model
    const organHighlightsFor3D: OrganHighlight[] = useMemo(() => {
        return extractOrganHighlightsFromText(inputFullText);
    }, [inputFullText]);

    // Auto-generate clickable phrases from summary and mappings
    const generatedPhrasesToMakeClickable = useMemo(() => {
        const potentialPhrases = new Set<string>();

        // Find all termPattern matches in summary points
        dischargeSummaryPointsFromImage.forEach((pointText) => {
            allMedicalMappings.forEach((mapping) => {
                const regex = new RegExp(mapping.termPattern.source, "gi");
                let match;
                while ((match = regex.exec(pointText)) !== null) {
                    potentialPhrases.add(match[0]);
                }
            });
        });

        // Add organ names if they appear in the summary
        const allMappedOrganNames = new Set<string>();
        allMedicalMappings.forEach((mapping) => {
            mapping.highlights.forEach((highlight) => {
                allMappedOrganNames.add(highlight.organName);
            });
        });

        dischargeSummaryPointsFromImage.forEach((pointText) => {
            allMappedOrganNames.forEach((organName) => {
                const organNameRegex = new RegExp(
                    `\\b${escapeRegExp(organName)}\\b`,
                    "gi"
                );
                let match;
                while ((match = organNameRegex.exec(pointText)) !== null) {
                    potentialPhrases.add(match[0]);
                }
            });
        });

        return Array.from(potentialPhrases);
    }, [dischargeSummaryPointsFromImage]);

    // Handles phrase click to highlight in input notes
    const handlePhraseClick = (phrase: string): void => {
        setTextToHighlightInInput("");
        setTimeout(() => {
            setTextToHighlightInInput(phrase);
        }, 0);
    };

    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                maxWidth: "1800px",
                margin: "0 auto",
                backgroundColor: "#f4f7f6",
            }}
        >
            <h1 style={{ textAlign: "center", color: "#333" }}>
                Medical Case Visualizer
            </h1>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                    flexWrap: "wrap",
                }}
            >
                <div
                    style={{
                        flex: "1 1 400px",
                        minWidth: "350px",
                        backgroundColor: "white",
                        padding: "15px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2 style={{ marginTop: 0, color: "#1a237e" }}>
                        Notes Summary
                    </h2>
                    <InputNotes
                        text={inputFullText}
                        highlightText={textToHighlightInInput}
                    />
                </div>
                <div
                    style={{
                        flex: "1 1 400px",
                        minWidth: "350px",
                        backgroundColor: "white",
                        padding: "15px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2 style={{ marginTop: 0, color: "#1a237e" }}>
                        Discharge Summary
                    </h2>
                    <DischargeSummary
                        summaryPoints={dischargeSummaryPointsFromImage}
                        clickablePhrases={generatedPhrasesToMakeClickable}
                        onPhraseClick={handlePhraseClick}
                    />
                </div>
            </div>
            <div
                style={{
                    marginTop: "20px",
                    backgroundColor: "white",
                    padding: "15px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
            >
                <h2
                    style={{
                        marginTop: 0,
                        color: "#1a237e",
                        textAlign: "center",
                    }}
                >
                    3D Patient Model Visualization
                </h2>
                <ThreeDModelViewer organsToHighlight={organHighlightsFor3D} />
            </div>
        </div>
    );
};

export default App;
