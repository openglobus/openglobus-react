import * as React from "react";
import {createContext, useCallback, useEffect, useRef, useState} from "react";
import {Layer, LayerProps, useGlobeContext} from '../../index';
import {Billboard, Entity, Geometry, GeoObject, Gltf, Label, Polyline, Strip} from '@openglobus/og';
import {Vector as GlobusVector} from '@openglobus/og';
import {IVectorParams} from '@openglobus/og/lib/layer/Vector';
import {EventCallback} from "@openglobus/og/lib/Events";

const VectorContext = createContext<{
    addEntity: (entity: Entity) => void,
    removeEntity: (entity: Entity) => void,
    addBillboard: (entity: Entity, billboard: Billboard) => void,
    removeBillboard: (entity: Entity) => void,
    addGeoObject: (entity: Entity, geoObject: GeoObject) => void,
    removeGeoObject: (entity: Entity) => void,
    addLabel: (entity: Entity, geoObject: Label) => void,
    removeLabel: (entity: Entity) => void,
    addGeometry: (entity: Entity, geometry: Geometry) => void,
    removeGeometry: (entity: Entity) => void,
    addPolyline: (entity: Entity, polyline: Polyline) => void,
    removePolyline: (entity: Entity) => void,
    addStrip: (entity: Entity, strip: Strip) => void,
    removeStrip: (entity: Entity) => void,
    addGltf: (entity: Entity, gltf: Entity[]) => void,
    removeGltf: (entity: Entity, gltf: Entity[]) => void,
}>({
    addEntity: () => {
    },
    removeEntity: () => {
    },
    addLabel: () => {
    },
    removeLabel: () => {
    },
    addBillboard: () => {
    },
    removeBillboard: () => {
    },
    addGeoObject: () => {
    },
    removeGeoObject: () => {
    },
    addGeometry: () => {
    },
    removeGeometry: () => {
    },
    addPolyline: () => {
    },
    removePolyline: () => {
    },
    addStrip: () => {
    },
    removeStrip: () => {
    },
    addGltf: (_entity: Entity, _gltf: Entity[]) => {
    },
    removeGltf: (_entity: Entity, _gltf: Entity[]) => {
    },
});

type EntityElement = React.ReactElement<{ type: typeof Entity }>;

export interface VectorPropsBase extends IVectorParams {
    children?: EntityElement | EntityElement[]
    name: string
    onMouseEnter?: EventCallback
    onDraw?: EventCallback
}

export type VectorProps = VectorPropsBase & LayerProps;

const Vector: React.FC<VectorProps> = ({visibility, children, name, ...rest}) => {
    const {globe} = useGlobeContext();
    const vectorRef = useRef<GlobusVector | null>(null);
    const [entities, setEntities] = useState<any[]>([]);
    const entitiesRef = useRef(new Set()); // To keep track of added entities

    useEffect(() => {
        if (typeof visibility === 'boolean' && vectorRef.current) {
            vectorRef.current.setVisibility(visibility);
        }
    }, [visibility]);

    useEffect(() => {
        if (globe) {
            vectorRef.current = new GlobusVector(name, rest);
            globe.planet.addLayer(vectorRef.current);
            if (rest.onDraw) vectorRef.current?.events.on('draw', rest.onDraw);
            if (rest.onMouseEnter) vectorRef.current?.events.on('mouseenter', rest.onMouseEnter);
            return () => {
                if (vectorRef.current) {
                    globe.planet.removeLayer(vectorRef.current);
                    if (rest.onDraw) vectorRef.current?.events.off('draw', rest.onDraw);
                    if (rest.onMouseEnter) vectorRef.current?.events.off('mouseenter', rest.onMouseEnter);
                }
            };
        }
    }, [globe]);

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

    const removeEntity = useCallback((entity: any) => {
        setEntities(prev => prev.filter(e => e !== entity));
        if (vectorRef.current) {
            vectorRef.current.removeEntity(entity);
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

    const addGeometry = useCallback((entity: Entity, geometry: Geometry) => {
        entity.setGeometry(geometry);
    }, []);

    const removeGeometry = useCallback((entity: Entity) => {
        entity.geometry?.remove();
    }, []);

    const addPolyline = useCallback((entity: Entity, polyline: Polyline) => {
        entity.setPolyline(polyline);
    }, []);

    const removePolyline = useCallback((entity: Entity) => {
        entity.polyline?.remove();
    }, []);

    const addStrip = useCallback((entity: Entity, strip: Strip) => {
        entity.setStrip(strip);
    }, []);

    const removeStrip = useCallback((entity: Entity) => {
        entity.strip?.remove();
    }, []);

    const addGltf = useCallback((entity: Entity, gltfEntities: Entity[]) => {
        entity.appendChildren(gltfEntities, true);
    }, []);

    const removeGltf = useCallback((entity: Entity, gltfEntities: Entity[]) => {
        gltfEntities.forEach(child => {
            if (child.parent === entity) {
                child.remove();
            }
        });
    }, []);

    return (
        <VectorContext.Provider value={{
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
        }}>
            <Layer layerRef={vectorRef} name={name} {...rest}>
                {children}
            </Layer>
        </VectorContext.Provider>
    );
};

export {Vector, VectorContext};
