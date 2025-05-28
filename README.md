# Medical Case Visualizer

## Description

A web application designed to help visualize medical case notes by displaying input text, a discharge summary, and highlighting relevant organs on a 3D model.

## Key Features

-   Displays original medical notes.
-   Shows a clickable discharge summary.
-   Highlights selected phrases from the summary within the original notes.
-   Visualizes mentioned organs on an interactive 3D human model.
-   Uses text analysis to map medical terms to 3D model highlights.

## Technologies Used

-   **Frontend**: React, Vite, TypeScript
-   **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
-   **Linting**: ESLint
-   **Package Management**: npm

## Setup and Running Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd medical-case-visualizer
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run development server**:
    ```bash
    npm run dev
    ```
4.  **Build for production**:
    ```bash
    npm run build
    ```
5.  **Lint code**:
    ```bash
    npm run lint
    ```

## Project Structure

```
medical-case-visualizer/
├── public/
│   └── body_model.glb         # Static assets, e.g., 3D model
├── src/
│   ├── components/            # React components
│   │   ├── ThreeDModelViewer.tsx
│   │   ├── InputNotes.tsx
│   │   └── DischargeSummary.tsx
│   ├── lib/                   # Core logic
│   │   └── medicalMapping.ts
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Application entry point
├── package.json               # Project dependencies and scripts
├── vite.config.ts             # Vite build tool configuration
└── tsconfig.json              # TypeScript configuration
```
