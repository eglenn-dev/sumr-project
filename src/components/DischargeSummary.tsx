import React from "react";

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface DischargeSummaryProps {
    summaryPoints: string[];
    clickablePhrases: string[];
    onPhraseClick: (phrase: string) => void;
}

const DischargeSummary: React.FC<DischargeSummaryProps> = ({
    summaryPoints,
    clickablePhrases,
    onPhraseClick,
}) => {
    const renderSummaryPoint = (
        pointText: string,
        pointKey: string | number
    ): React.ReactNode => {
        if (!clickablePhrases || clickablePhrases.length === 0) {
            return <li key={pointKey}>{pointText}</li>;
        }

        const sortedPhrases = [...clickablePhrases].sort(
            (a, b) => b.length - a.length
        );

        const phrasesRegex = new RegExp(
            sortedPhrases.map((p) => escapeRegExp(p)).join("|"),
            "gi"
        );

        const renderedParts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = phrasesRegex.exec(pointText)) !== null) {
            if (match.index > lastIndex) {
                renderedParts.push(
                    <React.Fragment key={`text-${lastIndex}`}>
                        {pointText.substring(lastIndex, match.index)}
                    </React.Fragment>
                );
            }
            const matchedPhraseText = match[0];
            renderedParts.push(
                <span
                    key={`phrase-${match.index}`}
                    onClick={() => onPhraseClick(matchedPhraseText)}
                    style={{
                        color: "#007bff",
                        cursor: "pointer",
                        fontWeight: "bold",
                        backgroundColor: "#fff3cd",
                        textDecoration: "underline",
                        padding: "0.5px 2px",
                        borderRadius: "3px",
                        border: "1px solid #ffeeba",
                    }}
                    title={`Click to find: "${matchedPhraseText}"`}
                >
                    {matchedPhraseText}
                </span>
            );
            lastIndex = phrasesRegex.lastIndex;
        }

        if (lastIndex < pointText.length) {
            renderedParts.push(
                <React.Fragment key={`text-${lastIndex}-end`}>
                    {pointText.substring(lastIndex)}
                </React.Fragment>
            );
        }

        return (
            <li key={pointKey}>
                {renderedParts.length > 0 ? renderedParts : pointText}
            </li>
        );
    };

    return (
        <div style={{ padding: "10px", border: "1px solid #ccc" }}>
            <p>
                Here is a chronological summary of the Discharge Summary in
                100-150 words with up to 10 bullet points, including references
                to bowel obstruction, bowel, ischemia, ascites, and perforation:
            </p>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                {summaryPoints.map((point, index) =>
                    renderSummaryPoint(point, `point-${index}`)
                )}
            </ul>
        </div>
    );
};

export default DischargeSummary;
