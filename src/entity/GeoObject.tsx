import * as React from "react";
import { useContext, useEffect, useRef } from "react";
import { GeoObject as GlobusGeoObject } from "@openglobus/og";
import { IGeoObjectParams } from "@openglobus/og/lib/js/entity/GeoObject";
import { EntityContext } from "../Entity";
import {useGlobusContext} from "../GlobeContext";

interface GeoObjectParams extends IGeoObjectParams {}

const GeoObject: React.FC<GeoObjectParams> = ({ ...params }) => {
    const { addBillboard, removeBillboard } = useContext(EntityContext);
    const billboardRef = useRef<GlobusGeoObject | null>(null);
    const {globus} = useGlobusContext();

    useEffect(() => {
        billboardRef.current = new GlobusGeoObject(params);
        if (billboardRef.current) {
            addBillboard(billboardRef.current);
        }

        return () => {
            if (billboardRef.current) {
                removeBillboard(billboardRef.current);
            }
        };
    }, [addBillboard, removeBillboard, globus]);

    return null;
};

export { GeoObject };
