import * as React from "react";
import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useGlobusContext} from './index';
import {Billboard as GlobusBillboard, Entity as GlobusEntity, LonLat} from '@openglobus/og';
import type {IEntityParams} from "@openglobus/og/lib/js/entity/Entity";

import {VectorContext} from "./Vector";
import {EventCallback} from "@openglobus/og/lib/js/Events";
import {NumberArray3} from "@openglobus/og/lib/js/math/Vec3";
import {Billboard} from "./entity";

type EntityChildElement = React.ReactElement<{ type: typeof Billboard }>;

const EntityContext = createContext<{
    removeBillboard: (b: any) => void
    addBillboard: (b: any) => void,
}>({
    addBillboard: () => {
    },
    removeBillboard: () => {
    }
});

interface EntityProps extends IEntityParams {
    children?: EntityChildElement,
    onDraw?: EventCallback
}

const Entity: React.FC<EntityProps> = ({lonlat, name, children, ...rest}) => {
    const {globus} = useGlobusContext();
    const {addEntity, removeEntity} = useContext(VectorContext);
    const entityRef = useRef<GlobusEntity | null>(null);
    const [billboard, setBillboard] = useState<GlobusBillboard | null>(null);

    useEffect(() => {
        if (lonlat) {
            if (!(lonlat instanceof LonLat)) lonlat = LonLat.createFromArray(lonlat as NumberArray3)
            entityRef.current?.setLonLat(lonlat);
        }
    }, [lonlat]);
    useEffect(() => {
        if (globus) {
            entityRef.current = new GlobusEntity({lonlat, name, ...rest});
            addEntity(entityRef.current);

            return () => {
                if (globus) {
                    removeEntity(entityRef.current)
                }
            };
        }
    }, [globus, addEntity, removeEntity]);
    useEffect(() => {
        if(billboard && !entityRef.current?.billboard) entityRef.current?.setBillboard(billboard);
    }, [billboard]);
    const addBillboard = useCallback((entity: GlobusBillboard) => {
        setBillboard(entity)
    }, []);

    const removeBillboard = useCallback((entity: any) => {
        entityRef.current?.billboard?.remove()
    }, []);

    return <EntityContext.Provider value={{addBillboard, removeBillboard}}>
        {children}
    </EntityContext.Provider>;
};

export {Entity, EntityContext};
   