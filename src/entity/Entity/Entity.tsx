import * as React from "react";
import {useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {useGlobeContext} from '@/index';
import {
    Billboard as GlobusBillboard,
    Entity as GlobusEntity,
    Geometry as GlobusGeometry,
    GeoObject as GlobusGeoObject,
    Label as GlobusLabel,
    math,
    Polyline as GlobusPolyline,
    Strip as GlobusStrip,
    Vec3
} from '@openglobus/og';
import type {IEntityParams} from "@openglobus/og";
import {VectorContext} from "@/layer/Vector/Vector";
import type {CartesianInput, LonLatInput} from "@/types/openglobus";
import {EntityCollectionContext} from "@/entity/EntityCollection";
import {useRenderer} from "@/renderer/Renderer";
import {toLonLat} from "@/utils/coordinates";

type EntityChildElement = React.ReactElement<any>;

export interface EntityParams extends Omit<IEntityParams, 'lonlat' | 'cartesian' | 'localPosition' | 'scale'> {
    children?: EntityChildElement | EntityChildElement[],
    visibility?: boolean,
    lonLat?: LonLatInput,
    cartesian?: CartesianInput,
    localPosition?: CartesianInput,
    scale?: number | CartesianInput,
    updateRelativeCenter?: boolean,
    readonly _addEntity?: (billboard: GlobusEntity) => void;
    readonly _removeEntity?: (billboard: GlobusEntity) => void;
}

const Entity = React.forwardRef<GlobusEntity, EntityParams>(({
                                            visibility,
                                            lonLat,
                                            name,
                                            children,
                                            yaw,
                                            pitch,
                                            roll,
                                            cartesian,
                                            updateRelativeCenter,
                                            _addEntity,
                                            _removeEntity,
                                            relativePosition,
                                            ...rest
                                        }, forwardedRef) => {
    const {globe} = useGlobeContext();
    const renderer = useRenderer()
    const vectorCtx = useContext(VectorContext);
    const entityCollectionCtx = useContext(EntityCollectionContext);
    const noop = (() => {
    })
    const parent = globe ?? renderer;
    const isParentGlobe = !!globe;
    const yawRad = yaw !== undefined ? yaw * math.RADIANS : undefined;
    const pitchRad = pitch !== undefined ? pitch * math.RADIANS : undefined;
    const rollRad = roll !== undefined ? roll * math.RADIANS : undefined;

    const ctx = isParentGlobe ? vectorCtx : entityCollectionCtx;

    const addEntity = ctx?.addEntity ?? noop;
    const removeEntity = ctx?.removeEntity ?? noop;
    const addBillboard = ctx?.addBillboard ?? noop;
    const removeBillboard = ctx?.removeBillboard ?? noop;
    const addGeoObject = ctx?.addGeoObject ?? noop;
    const removeGeoObject = ctx?.removeGeoObject ?? noop;
    const addLabel = ctx?.addLabel ?? noop;
    const removeLabel = ctx?.removeLabel ?? noop;
    const addGeometry = ctx?.addGeometry ?? noop;
    const removeGeometry = ctx?.removeGeometry ?? noop;
    const addPolyline = ctx?.addPolyline ?? noop;
    const removePolyline = ctx?.removePolyline ?? noop;
    const addStrip = ctx?.addStrip ?? noop;
    const removeStrip = ctx?.removeStrip ?? noop;
    const addGltf = ctx?.addGltf ?? noop;
    const removeGltf = ctx?.removeGltf ?? noop;


    const entityRef = useRef<GlobusEntity | null>(null);
    const [billboard, setBillboard] = useState<GlobusBillboard | null>(null);
    const [geoObject, setGeoObject] = useState<GlobusGeoObject | null>(null);
    const [label, setLabel] = useState<GlobusLabel | null>(null);
    const [geometry, setGeometry] = useState<GlobusGeometry | null>(null);
    const [gltf, setGltf] = useState<GlobusEntity[] | null>(null);
    const [polyline, setPolyline] = useState<GlobusPolyline | null>(null);
    const [strip, setStrip] = useState<GlobusStrip | null>(null);
    const [ready, setReady] = useState<boolean>(false);

    React.useImperativeHandle(forwardedRef, () => entityRef.current!, [ready]);

    const pendingChildrenRef = useRef<GlobusEntity[]>([]);
    useEffect(() => {
        if (lonLat) entityRef.current?.setLonLat(toLonLat(lonLat));
    }, [lonLat, billboard]);

    useEffect(() => {
        if (typeof visibility === 'boolean' && entityRef.current) {
            entityRef.current?.setVisibility(visibility);
        }
    }, [visibility]);

    useEffect(() => {
        if (cartesian instanceof Vec3 && entityRef.current) {
            entityRef.current.setCartesian3v(cartesian);
        } else if (Array.isArray(cartesian) && entityRef.current) {
            entityRef.current.setCartesian(cartesian[0], cartesian[1], cartesian[2]);
        }
    }, [cartesian]);

    useEffect(() => {
        const activeRenderer = globe?.renderer ?? renderer;
        if (updateRelativeCenter && ready && entityRef.current && activeRenderer) {
            activeRenderer.setRelativeCenter(entityRef.current.getAbsoluteCartesian());
        }
    }, [updateRelativeCenter, ready, lonLat, cartesian, globe, renderer]);

    useEffect(() => {
        if (yawRad !== undefined && entityRef.current) {
            entityRef.current.setYaw(yawRad);
        }
    }, [yawRad]);

    useEffect(() => {
        if (rollRad !== undefined && entityRef.current) {
            entityRef.current.setRoll(rollRad);
        }
    }, [rollRad]);

    useEffect(() => {
        if (pitchRad !== undefined && entityRef.current) {
            entityRef.current.setPitch(pitchRad);
        }
    }, [pitchRad]);

    useEffect(() => {
        if (typeof relativePosition === 'boolean' && entityRef.current) {
            entityRef.current.relativePosition = relativePosition;
        }
    }, [relativePosition]);

    useLayoutEffect(() => {
        if (!parent || _addEntity) return;

        const entity = new GlobusEntity({
            lonlat: lonLat,
            cartesian,
            name,
            yaw: yawRad,
            pitch: pitchRad,
            roll: rollRad,
            relativePosition,
            ...rest
        });
        entityRef.current = entity;
        addEntity(entity);

        setReady(true);
        if (gltf && entityRef.current) {
            addGltf(entityRef.current, gltf);

        }

        if (pendingChildrenRef.current.length && entityRef.current) {
            pendingChildrenRef.current.forEach(ch => entityRef.current!.appendChild(ch));
            pendingChildrenRef.current = [];
        }

        return () => {
            if (entityRef.current) {
                removeEntity(entityRef.current);
            }
            setReady(false);
        };
    }, [parent, addEntity, removeEntity, _addEntity]);

    useEffect(() => {
        if (!_addEntity) return;

        const entity = new GlobusEntity({
            visibility,
            name,
            yaw: yawRad,
            pitch: pitchRad,
            roll: rollRad,
            lonlat: lonLat,
            cartesian,
            relativePosition,
            ...rest
        });

        entityRef.current = entity;
        _addEntity(entity);

        if (gltf && entityRef.current) {
            addGltf(entityRef.current, gltf);
        }

        setReady(true);

        if (pendingChildrenRef.current.length && entityRef.current) {
            pendingChildrenRef.current.forEach(ch => entityRef.current!.appendChild(ch));
            pendingChildrenRef.current = [];
        }

        return () => {
            _removeEntity?.(entity);
            setReady(false);
        };
    }, [_addEntity, _removeEntity]);

    useEffect(() => {
        if (gltf && entityRef.current && ready) {
            addGltf(entityRef.current, gltf);
        }
    }, [gltf, ready]);

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
        setLabel(null);
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
        setGeometry(null);
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

    const addGltfContext = useCallback((GltfEntities: GlobusEntity[]) => {
        setGltf(GltfEntities);
    }, []);

    const removeGltfContext = useCallback(() => {
        setGltf(null);
    }, []);

    const _addEntityContext = useCallback((child: GlobusEntity) => {
        if (entityRef.current) {
            entityRef.current.appendChild(child);
        } else {
            pendingChildrenRef.current.push(child);
        }
    }, []);

    const _removeEntityContext = useCallback((child: GlobusEntity) => {
        if (entityRef.current) {
            const list = entityRef.current.childEntities || [];
            const idx = list.indexOf(child);
            if (idx !== -1) {
                list.splice(idx, 1);
            }
        } else {
            pendingChildrenRef.current = pendingChildrenRef.current.filter(c => c !== child);
        }
    }, []);

    const childProps = useMemo(() => ({
        _addEntity: _addEntityContext,
        _removeEntity: _removeEntityContext,
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
        _addGltf: addGltfContext,
        _removeGltf: removeGltfContext,
    }), [
        _addEntityContext,
        _removeEntityContext,
        addGeometryContext,
        removeGeometryContext,
        addLabelContext,
        removeLabelContext,
        addBillboardContext,
        removeBillboardContext,
        addGeoObjectContext,
        removeGeoObjectContext,
        addPolylineContext,
        removePolylineContext,
        addStripContext,
        removeStripContext,
        addGltfContext,
        removeGltfContext,
    ]);


    if (!children) return null;

    return (
        <>
            {React.Children.map(children, (child, i) =>
                React.isValidElement(child)
                    ? React.cloneElement(child, {...childProps, key: child.key ?? i})
                    : child
            )}
        </>
    );
});

Entity.displayName = 'Entity';

export {Entity};
