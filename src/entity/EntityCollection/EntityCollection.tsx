import * as React from 'react';
import {createContext, useCallback, useEffect, useRef, useState} from 'react';
import {
    Billboard,
    Entity as OgEntity,
    Entity,
    EntityCollection as OgEntityCollection,
    Geometry,
    GeoObject,
    Label,
    Polyline,
    Strip
} from '@openglobus/og';
// import type {IEntityCollectionParams} from '@openglobus/og'
import {EventCallback} from '@openglobus/og/lib/Events';
import {useParentNode} from '@/scene/RenderNode';
import type {NumberArray3} from "@openglobus/og/lib/math/Vec3";

interface IEntityCollectionParams {
    polygonOffsetUnits?: number;
    visibility?: boolean;
    labelMaxLetters?: number;
    pickingEnabled?: boolean;
    scaleByDistance?: NumberArray3;
    pickingScale?: number | NumberArray3;
    opacity?: number;
    useLighting?: boolean;
    entities?: Entity[];
    depthOrder?: number;
}

export const EntityCollectionContext = createContext<{
    addEntity: (entity: OgEntity) => void;
    removeEntity: (entity: OgEntity) => void;
    addBillboard: (entity: OgEntity, billboard: Billboard) => void;
    removeBillboard: (entity: OgEntity) => void;
    addGeoObject: (entity: OgEntity, geoObject: GeoObject) => void;
    removeGeoObject: (entity: OgEntity) => void;
    addLabel: (entity: OgEntity, label: Label) => void;
    removeLabel: (entity: OgEntity) => void;
    addGeometry: (entity: OgEntity, geometry: Geometry) => void;
    removeGeometry: (entity: OgEntity) => void;
    addPolyline: (entity: OgEntity, polyline: Polyline) => void;
    removePolyline: (entity: OgEntity) => void;
    addStrip: (entity: OgEntity, strip: Strip) => void;
    removeStrip: (entity: OgEntity) => void;
    addGltf: (entity: Entity, gltf: Entity[]) => void,
    removeGltf: (entity: Entity, gltf: Entity[]) => void,
}>({
    addEntity: () => {
    },
    removeEntity: () => {
    },
    addBillboard: () => {
    },
    removeBillboard: () => {
    },
    addGeoObject: () => {
    },
    removeGeoObject: () => {
    },
    addLabel: () => {
    },
    removeLabel: () => {
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

export interface EntityCollectionProps extends IEntityCollectionParams {
    name?: string;
    visible?: boolean;
    children?: React.ReactNode;
}

export const EntityCollection: React.FC<EntityCollectionProps> = ({
                                                                      visible = true,
                                                                      children,
                                                                      ...rest
                                                                  }) => {
    const parentNode = useParentNode();
    const collectionRef = useRef<OgEntityCollection | null>(null);
    const [entities, setEntities] = useState<OgEntity[]>([]);
    const entitiesRef = useRef(new Set<OgEntity>());

    useEffect(() => {
        if (!parentNode) return;

        const collection = new OgEntityCollection({});
        collection.setVisibility(visible);

        collection.addTo(parentNode);
        collectionRef.current = collection;

        return () => {
            collection.remove();
        };
    }, [parentNode]);

    useEffect(() => {
        collectionRef.current?.setVisibility(visible);
    }, [visible]);

    const addEntity = useCallback((entity: OgEntity) => {
        setEntities(prev => {
            if (!prev.includes(entity)) {
                return [...prev, entity];
            }
            return prev;
        });
    }, []);

    const removeEntity = useCallback((entity: OgEntity) => {
        setEntities(prev => prev.filter(e => e !== entity));
        if (collectionRef.current) {
            collectionRef.current.removeEntity(entity);
            entitiesRef.current.delete(entity);
        }
    }, []);

    useEffect(() => {
        if (collectionRef.current && entities.length > 0) {
            const newEntities = entities.filter(e => !entitiesRef.current.has(e));
            collectionRef.current.addEntities(newEntities);
            newEntities.forEach(e => entitiesRef.current.add(e));
        }
    }, [entities]);

    const addBillboard = useCallback((entity: OgEntity, billboard: Billboard) => {
        entity.setBillboard(billboard);
    }, []);

    const removeBillboard = useCallback((entity: OgEntity) => {
        entity.billboard?.remove();
    }, []);

    const addGeoObject = useCallback((entity: OgEntity, geoObject: GeoObject) => {
        entity.setGeoObject(geoObject);
    }, []);

    const removeGeoObject = useCallback((entity: OgEntity) => {
        entity.geoObject?.remove();
    }, []);

    const addLabel = useCallback((entity: OgEntity, label: Label) => {
        entity.setLabel(label);
    }, []);

    const removeLabel = useCallback((entity: OgEntity) => {
        entity.label?.remove();
    }, []);

    const addGeometry = useCallback((entity: OgEntity, geometry: Geometry) => {
        entity.setGeometry(geometry);
    }, []);

    const removeGeometry = useCallback((entity: OgEntity) => {
        entity.geometry?.remove();
    }, []);

    const addPolyline = useCallback((entity: OgEntity, polyline: Polyline) => {
        entity.setPolyline(polyline);
    }, []);

    const removePolyline = useCallback((entity: OgEntity) => {
        entity.polyline?.remove();
    }, []);

    const addStrip = useCallback((entity: OgEntity, strip: Strip) => {
        entity.setStrip(strip);
    }, []);

    const removeStrip = useCallback((entity: OgEntity) => {
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
        <EntityCollectionContext.Provider
            value={{
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
            }}
        >
            {children}
        </EntityCollectionContext.Provider>
    );
};
