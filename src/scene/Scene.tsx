import * as React from 'react';
import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {Scene as OgScene} from '@openglobus/og';
import {useRenderer} from '@/renderer/Renderer';

export interface SceneProps {
    name?: string;
    visible?: boolean;
    children?: React.ReactNode;
}

const SceneContext = createContext<OgScene | null>(null);

export const useParentScene = () => useContext(SceneContext);

export const Scene: React.FC<SceneProps> = ({
                                                name,
                                                visible = true,
                                                children
                                            }) => {
    const renderer = useRenderer();
    const sceneRef = useRef<OgScene | null>(null);
    const [contextScene, setContextScene] = useState<OgScene | null>(null);

    useEffect(() => {
        if (!renderer) return;

        const scene = new OgScene(name || 'scene');
        scene.setActive(visible);
        renderer.addScene(scene);

        sceneRef.current = scene;
        setContextScene(scene);

        return () => {
            scene.remove();
            scene.destroy();
            sceneRef.current = null;
            setContextScene(null);
        };
    }, [renderer, name]);

    useEffect(() => {
        sceneRef.current?.setActive(visible);
    }, [visible]);

    return (
        <SceneContext.Provider value={contextScene}>
            {children}
        </SceneContext.Provider>
    );
};
