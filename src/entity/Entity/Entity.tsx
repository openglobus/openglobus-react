import * as React from "react";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {useGlobeContext} from '@/index';
import {
    Billboard as GlobusBillboard,
    Entity as GlobusEntity,
    Geometry as GlobusGeometry,
    GeoObject as GlobusGeoObject,
    Label as GlobusLabel,
    LonLat,
    Polyline as GlobusPolyline,
    Strip as GlobusStrip
} from '@openglobus/og';
import type {IEntityParams} from "@openglobus/og/lib/entity/Entity";
import {VectorContext} from "@/layer/Vector/Vector";
import {EventCallback} from "@openglobus/og/lib/Events";
import {NumberArray3} from "@openglobus/og/lib/math/Vec3";
import {Billboard, Geometry, GeoObject, Label, Polyline, Strip} from "@/entity";

type EntityChildElement = React.ReactElement<
    typeof Billboard |
    typeof GeoObject |
    typeof Label |
    typeof Polyline |
    typeof Strip |
    typeof Geometry
>;

export interface EntityParams extends IEntityParams {
    children?: EntityChildElement | EntityChildElement[],
    visibility?: boolean,
    lon: number,
    lat: number,
    alt: number,
    onDraw?: EventCallback
}

const Entity: React.FC<EntityParams> = ({visibility, lon, lat, alt, lonlat, name, children, ...rest}) => {
    const {globe} = useGlobeContext();
    const {
        addEntity,
        removeEntity,
        addBillboard,
        removeBillboard,
        addGeoObject,
        removeGeoObject,
        addLabel,
        removeLabel,
        addGeometry,
        removeGeometry,
        addPolyline,
        removePolyline,
        addStrip,
        removeStrip
    } = useContext(VectorContext);
    const entityRef = useRef<GlobusEntity | null>(null);
    const [billboard, setBillboard] = useState<GlobusBillboard | null>(null);
    const [geoObject, setGeoObject] = useState<GlobusGeoObject | null>(null);
    const [label, setLabel] = useState<GlobusLabel | null>(null);
    const [geometry, setGeometry] = useState<GlobusGeometry | null>(null);
    const [polyline, setPolyline] = useState<GlobusPolyline | null>(null);
    const [strip, setStrip] = useState<GlobusStrip | null>(null);

    useEffect(() => {
        if (lonlat) {
            if (!(lonlat instanceof LonLat)) lonlat = LonLat.createFromArray(lonlat as NumberArray3);
            entityRef.current?.setLonLat(lonlat);
        }
    }, [lonlat, billboard]);

    useEffect(() => {
        if (name) entityRef.current?.setLonLat2(lon, lat, alt);
    }, [lon, lat, alt]);

    useEffect(() => {
        if (typeof visibility === 'boolean' && entityRef.current) {
            entityRef.current?.setVisibility(visibility);
        }
    }, [visibility]);

    useEffect(() => {
        if (globe) {
            entityRef.current = new GlobusEntity({
                lonlat: lonlat? lonlat : new LonLat(lon,lat,alt), name, ...rest
            });
            addEntity(entityRef.current);

            return () => {
                if (globe && entityRef.current) {
                    removeEntity(entityRef.current);
                }
            };
        }
    }, [globe, addEntity, removeEntity]);

    useEffect(() => {
        if (billboard && !entityRef.current?.billboard) entityRef.current?.setBillboard(billboard);
    }, [billboard]);

    useEffect(() => {
        if (geoObject && !entityRef.current?.geoObject) entityRef.current?.setGeoObject(geoObject);
    }, [geoObject]);

    useEffect(() => {
        if (label && !entityRef.current?.label) entityRef.current?.setLabel(label);
    }, [label]);

    useEffect(() => {
        if (geometry && !entityRef.current?.geometry) entityRef.current?.setGeometry(geometry);
    }, [geometry]);

    useEffect(() => {
        if (polyline && !entityRef.current?.polyline) entityRef.current?.setPolyline(polyline);
    }, [polyline]);

    useEffect(() => {
        if (strip && !entityRef.current?.strip) entityRef.current?.setStrip(strip);
    }, [strip]);

    const addBillboardContext = useCallback((entity: GlobusBillboard) => {
        setBillboard(entity);
        if (entityRef.current) {
            addBillboard(entityRef.current, entity);
        }
    }, [addBillboard]);

    const removeBillboardContext = useCallback(() => {
        if (entityRef.current) {
            removeBillboard(entityRef.current);
        }
        setBillboard(null);
    }, [removeBillboard]);

    const addGeoObjectContext = useCallback((entity: GlobusGeoObject) => {
        setGeoObject(entity);
        if (entityRef.current) {
            addGeoObject(entityRef.current, entity);
        }
    }, [addGeoObject]);

    const removeGeoObjectContext = useCallback(() => {
        if (entityRef.current) {
            removeGeoObject(entityRef.current);
        }
        setGeoObject(null);
    }, [removeGeoObject]);

    const addLabelContext = useCallback((entity: GlobusLabel) => {
        setLabel(entity);
        if (entityRef.current) {
            addLabel(entityRef.current, entity);
        }
    }, [addLabel]);

    const removeLabelContext = useCallback(() => {
        if (entityRef.current) {
            removeLabel(entityRef.current);
        }
        setGeoObject(null);
    }, [removeLabel]);

    const addGeometryContext = useCallback((entity: GlobusGeometry) => {
        setGeometry(entity);
        if (entityRef.current) {
            addGeometry(entityRef.current, entity);
        }
    }, [addGeometry]);

    const removeGeometryContext = useCallback(() => {
        if (entityRef.current) {
            removeGeometry(entityRef.current);
        }
        setGeoObject(null);
    }, [removeGeometry]);

    const addPolylineContext = useCallback((polyline: GlobusPolyline) => {
        setPolyline(polyline);
        if (entityRef.current) {
            addPolyline(entityRef.current, polyline);
        }
    }, [addPolyline]);

    const removePolylineContext = useCallback(() => {
        if (entityRef.current) {
            removePolyline(entityRef.current);
        }
        setPolyline(null);
    }, [removePolyline]);

    const addStripContext = useCallback((strip: GlobusStrip) => {
        setStrip(strip);
        if (entityRef.current) {
            addStrip(entityRef.current, strip);
        }
    }, [addStrip]);

    const removeStripContext = useCallback(() => {
        if (entityRef.current) {
            removeStrip(entityRef.current);
        }
        setStrip(null);
    }, [removeStrip]);

    const childProps = {
        _addGeometry: addGeometryContext,
        _removeGeometry: removeGeometryContext,
        _addLabel: addLabelContext,
        _removeLabel: removeLabelContext,
        _addBillboard: addBillboardContext,
        _removeBillboard: removeBillboardContext,
        _addGeoObject: addGeoObjectContext,
        _removeGeoObject: removeGeoObjectContext,
        _addPolyline: addPolylineContext,
        _removePolyline: removePolylineContext,
        _addStrip: addStripContext,
        _removeStrip: removeStripContext,
    };
    if (!children) {
        return null;
    }

    return (
        <>
            {Array.isArray(children) ? (
                children.map((child) =>
                    React.isValidElement(child) ? React.cloneElement(child, childProps) : child
                )
            ) : (
                React.isValidElement(children) ? React.cloneElement(children, childProps) : children
            )}
        </>
    );
};

export {Entity};
