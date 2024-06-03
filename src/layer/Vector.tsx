import * as React from "react";
import {createContext, useCallback, useEffect, useRef, useState} from "react";
import {useGlobusContext} from '../index';
import {Entity, Vector as GlobusVector} from '@openglobus/og';
import {IVectorParams} from '@openglobus/og/lib/js/layer/Vector';
import {EventCallback} from "@openglobus/og/lib/js/Events";

const VectorContext = createContext<{
    addEntity: (entity: any) => void,
    removeEntity: (entity: any) => void
}>({
    addEntity: () => {
    }, removeEntity: () => {
    }
});
type EntityElement = React.ReactElement<{ type: typeof Entity }>;

export interface VectorProps extends IVectorParams {
    children?: EntityElement | EntityElement[]
    name: string
    // onDraw?: EventCallback
    onMouseEnter?: EventCallback

}

const Vector: React.FC<VectorProps> = ({ children, name, ...rest}) => {
    const {globus} = useGlobusContext();
    const vectorRef = useRef<GlobusVector | null>(null);
    const [entities, setEntities] = useState<any[]>([]);
    const entitiesRef = useRef(new Set()); // To keep track of added entities

    useEffect(() => {
        if (globus) {
            vectorRef.current = new GlobusVector(name, rest);
            globus.planet.addLayer(vectorRef.current);
            // if (onDraw) vectorRef.current?.events.on('draw', onDraw)
            if (rest.onMouseEnter) vectorRef.current?.events.on('mouseenter', rest.onMouseEnter)
            return () => {
                if (vectorRef.current) {
                    globus.planet.removeLayer(vectorRef.current);
                    // if (onDraw) vectorRef.current?.events.off('draw', onDraw)
                    if (rest.onMouseEnter) vectorRef.current?.events.off('mouseenter', rest.onMouseEnter)
                }
            };
        }
    }, [globus]);

    useEffect(() => {
        if (vectorRef.current && entities.length > 0) {
            const newEntities = entities.filter(entity => !entitiesRef.current.has(entity));
            vectorRef.current.addEntities(newEntities);
            newEntities.forEach(entity => entitiesRef.current.add(entity));
        }
    }, [entities]);

    const addEntity = useCallback((entity: any) => {
        setEntities(prev => {
            if (!prev.includes(entity)) {
                return [...prev, entity];
            }
            return prev;
        });
    }, []);
    const removeEntity = useCallback(async (entity: any) => {
        setEntities(prev => prev.filter(e => e !== entity));
        if (vectorRef.current) {
            await vectorRef.current.removeEntity(entity);
            entitiesRef.current.delete(entity);
        }
    }, []);
    return (
        <VectorContext.Provider value={{addEntity, removeEntity}}>
            {children}
        </VectorContext.Provider>
    );
};

export {Vector, VectorContext};
