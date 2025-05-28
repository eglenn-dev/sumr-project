import React, { useEffect, useRef } from "react";

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface InputNotesProps {
    text: string;
    highlightText: string | null;
}

const InputNotes: React.FC<InputNotesProps> = ({ text, highlightText }) => {
    const highlightRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the highlighted text when it changes
        if (highlightRef.current && highlightText) {
            highlightRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [highlightText, text]); // Rerun if highlightText or base text changes

    if (!text) return null;

    let content: React.ReactNode = <>{text}</>;

    if (highlightText) {
        // Highlight only the first match (case-insensitive)
        const regex = new RegExp(`(${escapeRegExp(highlightText)})`, "i");
        const parts = text.split(regex);

        // Only highlight the first match for simplicity
        let found = false;
        content = parts.map((part, index) => {
            if (!found && part.toLowerCase() === highlightText.toLowerCase()) {
                found = true;
                return (
                    <span
                        key={index}
                        ref={highlightRef}
                        style={{
                            backgroundColor: "yellow",
                            fontWeight: "bold",
                        }}
                    >
                        {part} {/* Use 'part' to preserve original casing */}
                    </span>
                );
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
        });
    }

    return (
        <div
            ref={containerRef}
            style={{
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                padding: "10px",
                border: "1px solid #ccc",
                height: "400px",
                overflowY: "auto",
            }}
        >
            {content}
        </div>
    );
};

export default InputNotes;
