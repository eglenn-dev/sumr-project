import React, { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Center } from "@react-three/drei";
import * as THREE from "three";
import type { OrganHighlight } from "../lib/medicalMapping";

interface ModelProps {
    modelPath: string;
    organsToHighlight: OrganHighlight[];
    onOrganClick?: (organName: string, description?: string) => void;
}

const ModelComponent: React.FC<ModelProps> = ({
    modelPath,
    organsToHighlight,
    onOrganClick,
}) => {
    const { scene } = useGLTF(modelPath);
    const modelRef = useRef<THREE.Group>(null);

    // Cache original materials to allow reverting highlights
    const originalMaterials = useMemo(
        () => new Map<string, THREE.Material | THREE.Material[]>(),
        []
    );

    useEffect(() => {
        if (!scene) return;

        // Reset all mesh materials to their original state
        scene.traverse((node) => {
            if (node instanceof THREE.Mesh) {
                if (!originalMaterials.has(node.uuid)) {
                    originalMaterials.set(node.uuid, node.material);
                } else {
                    node.material = originalMaterials.get(node.uuid)!;
                }
                if (node.material instanceof THREE.Material) {
                    node.material = node.material.clone();
                } else if (Array.isArray(node.material)) {
                    node.material = node.material.map((m) => m.clone());
                }
            }
        });

        // Apply highlights to matching organs
        organsToHighlight.forEach((highlight) => {
            let foundMesh: THREE.Mesh | null = null;
            scene.traverse((node) => {
                if (node instanceof THREE.Mesh) {
                    if (
                        node.name
                            .toLowerCase()
                            .includes(highlight.organName.toLowerCase())
                    ) {
                        foundMesh = node;
                    }
                }
            });

            if (foundMesh) {
                const mesh = foundMesh as THREE.Mesh;
                const applyHighlight = (material: THREE.Material) => {
                    if (
                        material instanceof THREE.MeshStandardMaterial ||
                        material instanceof THREE.MeshPhysicalMaterial
                    ) {
                        material.color.set(highlight.color);
                        material.emissive?.set(highlight.color);
                        material.emissiveIntensity = 0.4;
                        material.needsUpdate = true;
                    }
                };

                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(applyHighlight);
                } else if (mesh.material instanceof THREE.Material) {
                    applyHighlight(mesh.material);
                }
            } else {
                // Mesh not found for this highlight
                console.warn(
                    `Mesh for organ "${highlight.organName}" not found in the model "${modelPath}". Check mesh names.`
                );
            }
        });
    }, [scene, organsToHighlight, modelPath, originalMaterials]);

    // Center the model in the scene
    return (
        <Center>
            <primitive
                object={scene}
                ref={modelRef}
                scale={1}
                onClick={(
                    event: import("@react-three/fiber").ThreeEvent<MouseEvent>
                ) => {
                    event.stopPropagation();
                    if (event.object instanceof THREE.Mesh && onOrganClick) {
                        const clickedOrganName = event.object.name;
                        const matchedHighlight = organsToHighlight.find((h) =>
                            clickedOrganName
                                .toLowerCase()
                                .includes(h.organName.toLowerCase())
                        );
                        if (matchedHighlight) {
                            onOrganClick(
                                matchedHighlight.organName,
                                matchedHighlight.description
                            );
                        } else {
                            onOrganClick(clickedOrganName);
                        }
                    }
                }}
            />
        </Center>
    );
};

const ModelLoadingError: React.FC = () => (
    <Html center>
        <div
            style={{
                color: "white",
                backgroundColor: "rgba(200, 0, 0, 0.8)",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                maxWidth: "300px",
            }}
        >
            <h3>Error Loading 3D Model</h3>
            <p>
                Please ensure <code>body_model.glb</code> is in the{" "}
                <code>/public</code> folder.
            </p>
            <p>
                Also, check that <code>organName</code> in{" "}
                <code>medicalMappings.ts</code> matches mesh names within your
                3D model.
            </p>
        </div>
    </Html>
);

interface ThreeDModelViewerProps {
    organsToHighlight: OrganHighlight[];
}

const ThreeDModelViewer: React.FC<ThreeDModelViewerProps> = ({
    organsToHighlight,
}) => {
    const modelPath = "/body_model.glb";
    const [clickedOrganInfo, setClickedOrganInfo] = useState<string | null>(
        null
    );

    // Show info for clicked organ, then hide after 5 seconds
    const handleOrganClick = (organName: string, description?: string) => {
        setClickedOrganInfo(description || `Clicked: ${organName}`);
        setTimeout(() => setClickedOrganInfo(null), 5000);
    };

    return (
        <div
            style={{
                height: "600px",
                width: "100%",
                border: "1px solid #444",
                borderRadius: "8px",
                backgroundColor: "#282c34",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {clickedOrganInfo && (
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        zIndex: 10,
                        fontSize: "0.9em",
                    }}
                >
                    {clickedOrganInfo}
                </div>
            )}
            <Canvas camera={{ position: [0, 1.5, 200], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <directionalLight
                    position={[10, 10, 10]}
                    intensity={2.0}
                    castShadow
                />
                <directionalLight position={[-10, 10, -5]} intensity={1.0} />
                <Suspense
                    fallback={
                        <Html center>
                            <p style={{ color: "white" }}>
                                Loading 3D Model...
                            </p>
                        </Html>
                    }
                >
                    <React.Fragment>
                        <ErrorBoundary FallbackComponent={ModelLoadingError}>
                            <ModelComponent
                                modelPath={modelPath}
                                organsToHighlight={organsToHighlight}
                                onOrganClick={handleOrganClick}
                            />
                        </ErrorBoundary>
                    </React.Fragment>
                </Suspense>
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                />
            </Canvas>
        </div>
    );
};

// Simple error boundary for 3D model loading/rendering
interface ErrorBoundaryProps {
    children: React.ReactNode;
    FallbackComponent: React.ComponentType<{ error: Error }>;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("3D Model Rendering Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <this.props.FallbackComponent
                    error={this.state.error ?? new Error("Unknown error")}
                />
            );
        }
        return this.props.children;
    }
}

export default ThreeDModelViewer;
