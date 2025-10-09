import * as React from "react";
import {useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Gltf, useGlobeContext} from '@/index';
import {
    Billboard as GlobusBillboard,
    Entity as GlobusEntity,
    Geometry as GlobusGeometry,
    GeoObject as GlobusGeoObject,
    Label as GlobusLabel,
    LonLat,
    math,
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
    typeof Gltf |
    typeof Entity |
    typeof Geometry
>;

export interface EntityParams extends IEntityParams {
    children?: EntityChildElement | EntityChildElement[],
    visibility?: boolean,
    lon?: number,
    lat?: number,
    alt?: number,
    onDraw?: EventCallback
    readonly _addEntity?: (billboard: GlobusEntity) => void;
    readonly _removeEntity?: (billboard: GlobusEntity) => void;
}

const Entity: React.FC<EntityParams> = ({
                                            visibility,
                                            lon,
                                            lat,
                                            alt,
                                            lonlat,
                                            name,
                                            children,
                                            yaw,
                                            pitch,
                                            roll,
                                            cartesian,
                                            _addEntity,
                                            _removeEntity,
                                            relativePosition,
                                            ...rest
                                        }) => {
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
        removeStrip,
        addGltf,
        removeGltf
    } = useContext(VectorContext);

    const entityRef = useRef<GlobusEntity | null>(null);
    const [billboard, setBillboard] = useState<GlobusBillboard | null>(null);
    const [geoObject, setGeoObject] = useState<GlobusGeoObject | null>(null);
    const [label, setLabel] = useState<GlobusLabel | null>(null);
    const [geometry, setGeometry] = useState<GlobusGeometry | null>(null);
    const [gltf, setGltf] = useState<GlobusEntity[] | null>(null);
    const [polyline, setPolyline] = useState<GlobusPolyline | null>(null);
    const [strip, setStrip] = useState<GlobusStrip | null>(null);
    const [ready, setReady] = useState<boolean>(false);

    const pendingChildrenRef = useRef<GlobusEntity[]>([]);

    useEffect(() => {
        if (lonlat) {
            if (!(lonlat instanceof LonLat)) lonlat = LonLat.createFromArray(lonlat as NumberArray3);
            entityRef.current?.setLonLat(lonlat);
        }
    }, [lonlat, billboard]);

    useEffect(() => {
        if (typeof lon === "number" && typeof lat === "number" && typeof alt === "number") {
            entityRef.current?.setLonLat2(lon, lat, alt);
        }
    }, [lon, lat, alt]);

    useEffect(() => {
        if (typeof visibility === 'boolean' && entityRef.current) {
            entityRef.current?.setVisibility(visibility);
        }
    }, [visibility]);

    useEffect(() => {
        if (Array.isArray(cartesian) && entityRef.current) {
            entityRef.current?.setCartesian(cartesian[0], cartesian[1], cartesian[2])
        }
    }, []);

    useEffect(() => {
        if (typeof yaw === 'number' && entityRef.current) {
            entityRef.current?.setYaw(yaw * math.RADIANS)
        }
    }, [yaw]);

    useEffect(() => {
        if (typeof roll === 'number' && entityRef.current) {
            entityRef.current?.setRoll(roll * math.RADIANS)
        }
    }, [roll]);

    useEffect(() => {
        if (typeof pitch === 'number' && entityRef.current) {
            entityRef.current?.setPitch(pitch * math.RADIANS)
        }
    }, [pitch]);

    useEffect(() => {
        if (typeof relativePosition === 'boolean' && entityRef.current) {
            entityRef.current.relativePosition = relativePosition;
        }
    }, [relativePosition]);

    useLayoutEffect(() => {
        if (!globe || _addEntity) return;

        const entity = new GlobusEntity({
            lonlat: lonlat ? lonlat : new LonLat(lon, lat, alt),
            name,
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
    }, [globe, addEntity, removeEntity, _addEntity]);

    useEffect(() => {
        if (!_addEntity) return;

        const entity = new GlobusEntity({
            visibility,
            name,
            yaw,
            pitch,
            roll,
            lonlat: lonlat ? lonlat : new LonLat(lon, lat, alt),
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
};

export {Entity};
