import * as React from "react";
import { useEffect, useRef } from "react";
import { Geometry as GlobusGeometry, Vec4 } from "@openglobus/og";
import { GeometryTypeEnum, GeometryTypeToCoordinates, IGeometryParams  } from "@openglobus/og/lib/js/entity/Geometry";
import { htmlColorToRgba } from "@openglobus/og/lib/js/utils/shared";


export interface GeometryParamsExtended<T extends keyof typeof GeometryTypeEnum = keyof typeof GeometryTypeEnum> extends Omit<IGeometryParams, 'style'> {
    readonly type: T;
    readonly coordinates: GeometryTypeToCoordinates[T];
    readonly _addGeometry?: (geometry: GlobusGeometry) => void;
    readonly _removeGeometry?: (geometry: GlobusGeometry) => void;
}

export type GeometryParams<T extends keyof typeof GeometryTypeEnum = keyof typeof GeometryTypeEnum> =
    Omit<GeometryParamsExtended<T>, 'style'>
    & Partial<IGeometryParams['style']>;

function isValidGeometry<T extends keyof typeof GeometryTypeEnum>(params: GeometryParams<T>): params is GeometryParams<T> {
    switch (params.type) {
        case 'POINT':
            return Array.isArray(params.coordinates) && params.coordinates.length >= 2 && typeof params.coordinates[0] === 'number';
        case 'LINESTRING':
            return Array.isArray(params.coordinates) && params.coordinates.every(coord => Array.isArray(coord) && coord.length >= 2 && typeof coord[0] === 'number');
        case 'POLYGON':
            return Array.isArray(params.coordinates) && params.coordinates.every(linearRing => Array.isArray(linearRing) && linearRing.every(coord => Array.isArray(coord) && coord.length >= 2 && typeof coord[0] === 'number'));
        case 'MULTIPOLYGON':
            return Array.isArray(params.coordinates) && params.coordinates.every(polygon => Array.isArray(polygon) && polygon.every(linearRing => Array.isArray(linearRing) && linearRing.every(coord => Array.isArray(coord) && coord.length >= 2 && typeof coord[0] === 'number')));
        case 'MULTILINESTRING':
            return Array.isArray(params.coordinates) && params.coordinates.every(lineString => Array.isArray(lineString) && lineString.every(coord => Array.isArray(coord) && coord.length >= 2 && typeof coord[0] === 'number'));
        default:
            return false;
    }
}

const Geometry = <T extends keyof typeof GeometryTypeEnum>(params: GeometryParams<T>) => {
    const {
        visibility,
        fillColor,
        lineColor,
        strokeColor,
        lineWidth,
        strokeWidth,
        type, coordinates,
        _addGeometry,
        _removeGeometry,
        ...geometryParams
    } = params;

    const geometryRef = useRef<GlobusGeometry | null>(null);

    if (!isValidGeometry({ type, coordinates })) {
        throw new Error(`Invalid coordinates for type ${type}`);
    }

    useEffect(() => {
        if (typeof visibility === 'boolean' && geometryRef.current) {
            geometryRef.current.setVisibility(visibility);
        }
    }, [visibility]);

    useEffect(() => {
        if (fillColor !== undefined && geometryRef.current) {
            if (fillColor instanceof Vec4) {
                geometryRef.current.setFillColor4v(fillColor);
            } else if (Array.isArray(fillColor)) {
                geometryRef.current.setFillColor(...fillColor);
            } else if (typeof fillColor === 'string' && geometryRef.current) {
                const fillColorVec = htmlColorToRgba(fillColor);
                geometryRef.current.setFillColor4v(fillColorVec);
            }
        }
    }, [fillColor]);

    useEffect(() => {
        if (lineColor !== undefined && geometryRef.current) {
            if (lineColor instanceof Vec4) {
                geometryRef.current.setLineColor4v(lineColor);
            } else if (Array.isArray(lineColor)) {
                geometryRef.current.setLineColor(...lineColor);
            } else if (typeof lineColor === 'string' && geometryRef.current) {
                const lineColorVec = htmlColorToRgba(lineColor);
                geometryRef.current.setLineColor4v(lineColorVec);
            }
        }
    }, [lineColor]);

    useEffect(() => {
        if (strokeColor !== undefined && geometryRef.current) {
            if (strokeColor instanceof Vec4) {
                geometryRef.current.setStrokeColor4v(strokeColor);
            } else if (Array.isArray(strokeColor)) {
                geometryRef.current.setStrokeColor(...strokeColor);
            } else if (typeof strokeColor === 'string' && geometryRef.current) {
                const strokeColorVec = htmlColorToRgba(strokeColor);
                geometryRef.current.setStrokeColor4v(strokeColorVec);
            }
        }
    }, [strokeColor]);

    useEffect(() => {
        if (typeof lineWidth === 'number' && geometryRef.current) {
            geometryRef.current.setLineWidth(lineWidth);
        }
    }, [lineWidth]);

    useEffect(() => {
        if (typeof strokeWidth === 'number' && geometryRef.current) {
            geometryRef.current.setStrokeWidth(strokeWidth);
        }
    }, [strokeWidth]);

    useEffect(() => {
        geometryRef.current = new GlobusGeometry({
            ...params,
            type,
            coordinates,
            style: {
                fillColor,
                lineColor,
                strokeColor,
                lineWidth,
                strokeWidth
            },
            visibility
        });
        if (geometryRef.current && _addGeometry) {
            _addGeometry(geometryRef.current);
        }

        return () => {
            if (geometryRef.current && _removeGeometry) {
                _removeGeometry(geometryRef.current);
            }
        };
    }, [_addGeometry, _removeGeometry]);

    return null;
};

export { Geometry };
