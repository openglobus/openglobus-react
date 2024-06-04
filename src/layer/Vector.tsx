import * as React from "react";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useGlobusContext } from '../index';
import { Vector as GlobusVector } from '@openglobus/og';
import type { Entity, Billboard, GeoObject, Label } from '@openglobus/og';
import { IVectorParams } from '@openglobus/og/lib/js/layer/Vector';
import { EventCallback } from "@openglobus/og/lib/js/Events";

const VectorContext = createContext<{
    addEntity: (entity: Entity) => void,
    removeEntity: (entity: Entity) => void,
    addBillboard: (entity: Entity, billboard: Billboard) => void,
    removeBillboard: (entity: Entity) => void,
    addGeoObject: (entity: Entity, geoObject: GeoObject) => void,
    removeGeoObject: (entity: Entity) => void,
    addLabel: (entity: Entity, geoObject: Label) => void,
    removeLabel: (entity: Entity) => void,
}>({
    addEntity: () => {},
    removeEntity: () => {},
    addLabel: () => {},
    removeLabel: () => {},
    addBillboard: () => {},
    removeBillboard: () => {},
    addGeoObject: () => {},
    removeGeoObject: () => {}
});

type EntityElement = React.ReactElement<{ type: typeof Entity }>;

export interface VectorProps extends IVectorParams {
    children?: EntityElement | EntityElement[]
    name: string
    onMouseEnter?: EventCallback
    onDraw?: EventCallback
}

const Vector: React.FC<VectorProps> = ({ children, name, ...rest }) => {
    const { globus } = useGlobusContext();
    const vectorRef = useRef<GlobusVector | null>(null);
    const [entities, setEntities] = useState<any[]>([]);
    const entitiesRef = useRef(new Set()); // To keep track of added entities

    useEffect(() => {
        if (globus) {
            vectorRef.current = new GlobusVector(name, rest);
            globus.planet.addLayer(vectorRef.current);
            if (rest.onDraw) vectorRef.current?.events.on('draw', rest.onDraw);
            if (rest.onMouseEnter) vectorRef.current?.events.on('mouseenter', rest.onMouseEnter);
            return () => {
                if (vectorRef.current) {
                    globus.planet.removeLayer(vectorRef.current);
                    if (rest.onDraw) vectorRef.current?.events.off('draw', rest.onDraw);
                    if (rest.onMouseEnter) vectorRef.current?.events.off('mouseenter', rest.onMouseEnter);
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

    const addBillboard = useCallback((entity: Entity, billboard: Billboard) => {
        entity.setBillboard(billboard);
    }, []);

    const removeBillboard = useCallback((entity: Entity) => {
        entity.billboard?.remove();
    }, []);

    const addGeoObject = useCallback((entity: Entity, geoObject: GeoObject) => {
        entity.setGeoObject(geoObject);
    }, []);

    const removeGeoObject = useCallback((entity: Entity) => {
        entity.geoObject?.remove();
    }, []);

    const addLabel = useCallback((entity: Entity, label: Label) => {
        entity.setLabel(label);
    }, []);

    const removeLabel = useCallback((entity: Entity) => {
        entity.label?.remove();
    }, []);

    return (
        <VectorContext.Provider value={{ addEntity, removeEntity, addBillboard, removeBillboard, addGeoObject, removeGeoObject, addLabel, removeLabel }}>
            {children}
        </VectorContext.Provider>
    );
};

export { Vector, VectorContext };
