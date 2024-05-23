import * as React from "react";
import { useEffect, useContext, useRef } from 'react';
import { useGlobusContext } from './index';
// @ts-ignore
import { IEntityParams, Entity as GlobusEntity } from '@openglobus/og';
import {VectorContext} from "./Vector";

const Entity: React.FC<{ params: IEntityParams }> = ({ params }) => {
    const { globus } = useGlobusContext();
    const { addEntity, removeEntity } = useContext(VectorContext);
    const entityRef = useRef<GlobusEntity | null>(null);

    useEffect(() => {
        if (globus) {
            entityRef.current = new GlobusEntity(params);
            addEntity(entityRef.current);

            return () => {
                if (globus) {
                removeEntity(entityRef.current)
                }
                // Cleanup if needed
            };
        }
    }, [globus,  addEntity]);

    return null;
};

export { Entity };
   