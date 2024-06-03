import * as React from "react";
import {useContext, useEffect, useRef} from "react";
import {Billboard as GlobusBillboard, Vec2, Vec3} from "@openglobus/og";
import {IBillboardParams} from "@openglobus/og/lib/js/entity/Billboard";
import {EntityContext} from "./Entity";
import {RADIANS} from "@openglobus/og/lib/js/math";

export interface BillboardParams extends IBillboardParams {
    name?: string;
}

const Billboard: React.FC<BillboardParams> = ({visibility, src, size, color, rotation, offset, ...params}) => {
    const {addBillboard, removeBillboard} = useContext(EntityContext);
    const billboardRef = useRef<GlobusBillboard | null>(null);

    useEffect(() => {
        if (typeof visibility === 'boolean' && billboardRef.current) {
            billboardRef.current?.setVisibility(visibility)
        }
    }, [visibility]);

    useEffect(() => {
        if (src && billboardRef.current) {
            billboardRef.current?.setSrc(src)
        }
    }, [src]);

    useEffect(() => {
        if (rotation && billboardRef.current) {
            billboardRef.current?.setRotation(rotation * RADIANS)
        }
    }, [rotation]);


    useEffect(() => {
        if (offset && billboardRef.current) {
            if (offset instanceof Vec3) {
                billboardRef.current?.setOffset(offset.x, offset.y, offset.z);
            } else if (offset instanceof Vec2) {
                billboardRef.current?.setOffset(offset.x, offset.y);
            } else {
                billboardRef.current?.setOffset(offset[0],offset[1],offset[2]);
            }
        }
    }, [offset]);

    useEffect(() => {
        if (size && billboardRef.current) {
            billboardRef.current?.setSize(size[0], size[1])
        }
    }, [size]);

    useEffect(() => {
        if (typeof color === 'string' && billboardRef.current) {
            billboardRef.current?.setColorHTML(color)
        }
    }, [color]);

    useEffect(() => {
        billboardRef.current = new GlobusBillboard({
            ...params,
            color,
            size,
            src,
            offset,
            visibility,
            rotation: rotation ? rotation * RADIANS: 0
        });
        if (billboardRef.current) {
            addBillboard(billboardRef.current);
        }

        return () => {
            if (billboardRef.current) {
                removeBillboard(billboardRef.current);
            }
        };
    }, [addBillboard, removeBillboard]);

    return null;
};

export {Billboard};
