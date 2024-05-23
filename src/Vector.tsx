import * as React from "react";
import  {createContext, useCallback, useEffect, useRef, useState} from 'react';
import {useGlobusContext} from './index';
import {Vector as GlobusVector} from '@openglobus/og';
import { IVectorParams } from '@openglobus/og/lib/js/layer/Vector';

const VectorContext = createContext<{ addEntity: (entity: any) => void ,removeEntity:(entity: any) => void}>({ addEntity: () => {},removeEntity: () => {} });

const Vector: React.FC<{ children?: React.ReactNode, params: IVectorParams, name: string }> = ({ params, children , name}) => {
    const { globus } = useGlobusContext();
    const vectorRef = useRef<GlobusVector | null>(null);
    const [entities, setEntities] = useState<any[]>([]);
    const entitiesRef = useRef(new Set()); // To keep track of added entities

    useEffect(() => {
        if (globus) {
            vectorRef.current = new GlobusVector(name, params);
            globus.planet.addLayer(vectorRef.current);

            return () => {
                if (vectorRef.current) {
                    globus.planet.removeLayer(vectorRef.current);
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
        <VectorContext.Provider value={{ addEntity, removeEntity }}>
            {children}
        </VectorContext.Provider>
    );
};

export { Vector, VectorContext };
