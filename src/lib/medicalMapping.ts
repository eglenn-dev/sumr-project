export interface OrganHighlight {
    organName: string; // Must match mesh name in 3D model
    color: string;
    description?: string;
}

export interface MedicalTermMapping {
    termPattern: RegExp;
    highlights: OrganHighlight[];
}

// Mapping of medical terms to 3D model mesh highlights
export const mappings: MedicalTermMapping[] = [
    {
        termPattern: /abdominal pain/i,
        highlights: [
            {
                organName: "06_Abdomen",
                color: "#FF6347",
                description: "Abdominal Pain (Abdomen)",
            },
            {
                organName: "07_Lower_abdomen",
                color: "#FF6347",
                description: "Abdominal Pain (Lower Abdomen)",
            },
        ],
    },
    {
        termPattern: /large bowel obstruction|cecal volvulus/i,
        highlights: [
            {
                organName: "06_Abdomen",
                color: "#FFA500",
                description: "Bowel Obstruction (Abdomen Area)",
            },
            {
                organName: "07_Lower_abdomen",
                color: "#FFA500",
                description: "Bowel Obstruction (Lower Abdomen Area)",
            },
        ],
    },
    {
        termPattern: /necrotic gut/i,
        highlights: [
            {
                organName: "06_Abdomen",
                color: "#8B0000",
                description: "Necrotic Gut (Abdomen Area)",
            },
            {
                organName: "07_Lower_abdomen",
                color: "#8B0000",
                description: "Necrotic Gut (Lower Abdomen Area)",
            },
        ],
    },
    {
        termPattern: /respiratory distress/i,
        highlights: [
            {
                organName: "05_Chest",
                color: "#1E90FF",
                description: "Respiratory Distress (Chest Area)",
            },
        ],
    },
    {
        termPattern: /right nephrectomy/i,
        highlights: [
            {
                organName: "21_Lower_back",
                color: "#A9A9A9",
                description: "Right Nephrectomy (Lower Back/Kidney Area)",
            },
        ],
    },
    {
        termPattern: /headache/i,
        highlights: [
            {
                organName: "01_Scalp",
                color: "#FFEB3B",
                description: "Headache (Scalp)",
            },
            {
                organName: "SA_01_FOREHEAD",
                color: "#FFEB3B",
                description: "Headache (Forehead)",
            },
            {
                organName: "SA_02_TEMPLES",
                color: "#FFEB3B",
                description: "Headache (Temples)",
            },
        ],
    },
    {
        termPattern: /facial injury|face trauma/i,
        highlights: [
            {
                organName: "02_Face",
                color: "#E91E63",
                description: "Facial Injury",
            },
            {
                organName: "SA_10_CHEEKS",
                color: "#E91E63",
                description: "Facial Injury (Cheeks)",
            },
            {
                organName: "SA_13_JAW",
                color: "#E91E63",
                description: "Facial Injury (Jaw)",
            },
        ],
    },
    {
        termPattern: /arm injury/i,
        highlights: [
            {
                organName: "10_Upper_arms",
                color: "#9C27B0",
                description: "Arm Injury (Upper Arms)",
            },
            {
                organName: "12_Fore_arms",
                color: "#9C27B0",
                description: "Arm Injury (Forearms)",
            },
            {
                organName: "11_Elbows",
                color: "#9C27B0",
                description: "Arm Injury (Elbows)",
            },
            {
                organName: "13_Hand_back",
                color: "#9C27B0",
                description: "Arm Injury (Back of Hand)",
            },
            {
                organName: "14_Hand_palms",
                color: "#9C27B0",
                description: "Arm Injury (Palm of Hand)",
            },
        ],
    },
    {
        termPattern: /leg pain|leg injury/i,
        highlights: [
            {
                organName: "15_Thighs",
                color: "#00BCD4",
                description: "Leg Issue (Thighs)",
            },
            {
                organName: "17_Legs",
                color: "#00BCD4",
                description: "Leg Issue (Lower Legs)",
            },
            {
                organName: "16_Knees",
                color: "#00BCD4",
                description: "Leg Issue (Knees)",
            },
        ],
    },
    {
        termPattern: /back pain/i,
        highlights: [
            {
                organName: "20_Back",
                color: "#4CAF50",
                description: "Back Pain (Upper/Mid Back)",
            },
            {
                organName: "21_Lower_back",
                color: "#4CAF50",
                description: "Back Pain (Lower Back)",
            },
        ],
    },
];

// Returns all highlights for matching terms in the input text
export const extractOrganHighlightsFromText = (
    text: string
): OrganHighlight[] => {
    const allHighlights: OrganHighlight[] = [];
    const addedOrganColorCombinations = new Set<string>();

    mappings.forEach((mapping) => {
        if (mapping.termPattern.test(text)) {
            mapping.highlights.forEach((highlight) => {
                const key = `${highlight.organName}-${highlight.color}`;
                if (!addedOrganColorCombinations.has(key)) {
                    allHighlights.push(highlight);
                    addedOrganColorCombinations.add(key);
                }
            });
        }
    });
    return allHighlights;
};
