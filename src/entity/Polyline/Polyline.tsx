import * as React from "react";
import {useEffect, useRef} from "react";
import {LonLat, Polyline as GlobusPolyline, Vec3} from "@openglobus/og";
import {IPolylineParams} from "@openglobus/og/lib/js/entity/Polyline";
import {htmlColorToRgba} from "@openglobus/og/lib/js/utils/shared";

type CSSColor =
    | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure'
    | 'beige' | 'bisque' | 'black' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood'
    | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan'
    | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkkhaki' | 'darkmagenta'
    | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen'
    | 'darkslateblue' | 'darkslategray' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue'
    | 'dimgray' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro'
    | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'honeydew' | 'hotpink'
    | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon'
    | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen'
    | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightsteelblue'
    | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue'
    | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen'
    | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin'
    | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod'
    | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum'
    | 'powderblue' | 'purple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown'
    | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'snow' | 'springgreen'
    | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'white' | 'whitesmoke'
    | 'yellow' | 'yellowgreen'
    | `#${string}` // HEX
    | `rgb(${number}, ${number}, ${number})`
    | `rgba(${number}, ${number}, ${number}, ${number | number})`
    | `hsl(${number}, ${number}%, ${number}%)`
    | `hsla(${number}, ${number}%, ${number}%, ${number | number})`;

export interface PolylineParams extends Omit<IPolylineParams, 'pathColors' | 'pathLonLat' | 'path3v'> {
    path?: IPolylineParams['pathLonLat'] | IPolylineParams['path3v'];
    pathColors?: CSSColor[][] | IPolylineParams['pathColors'];
    readonly _addPolyline?: (billboard: GlobusPolyline) => void;
    readonly _removePolyline?: (billboard: GlobusPolyline) => void;
}


const Polyline: React.FC<PolylineParams> = ({
                                                visibility,
                                                color,
                                                altitude,
                                                thickness,
                                                opacity,
                                                isClosed,
                                                pathColors,
                                                path,
                                                _addPolyline,
                                                _removePolyline,
                                                ...params
                                            }) => {
    const polylineRef = useRef<GlobusPolyline | null>(null);

    useEffect(() => {
        if (typeof visibility === 'boolean' && polylineRef.current) {
            polylineRef.current?.setVisibility(visibility)
        }
    }, [visibility]);

    useEffect(() => {
        if (typeof color === 'string' && polylineRef.current) {
            polylineRef.current?.setColorHTML(color)
        }
    }, [color]);

    useEffect(() => {
        if (typeof altitude === 'number' && polylineRef.current) {
            polylineRef.current?.setAltitude(altitude)
        }
    }, [altitude]);

    useEffect(() => {
        if (typeof thickness === 'number' && polylineRef.current) {
            polylineRef.current?.setThickness(thickness)
        }
    }, [thickness]);

    useEffect(() => {
        if (typeof opacity === 'number' && polylineRef.current) {
            polylineRef.current?.setOpacity(opacity)
        }
    }, [opacity]);

    const isPathv3 = (path: PolylineParams['path']): path is IPolylineParams['path3v'] => {
        return Array.isArray(path) && path.length > 0 && path[0][0] instanceof Vec3;
    }

    const isPathLonLat = (path: PolylineParams['path']): path is IPolylineParams['pathLonLat'] => {
        return Array.isArray(path) && path.length > 0 && (path[0][0] instanceof LonLat || path[0][0] instanceof Array);
    }
    const convertPathArrayToLonLat = (path: PolylineParams['path']): IPolylineParams['pathLonLat'] => {
        return (path as [number, number, number][][]).map((arr) => arr.map(arr2 => LonLat.createFromArray(arr2)))
    }
    useEffect(() => {
        if (polylineRef.current && path !== undefined) {
            if (isPathLonLat(path)) {
                polylineRef.current?.setPathLonLat(path)
            } else if (isPathv3(path)) {
                polylineRef.current?.setPath3v(path)
            } else {
                const pathLonLat = convertPathArrayToLonLat(path);
                if (pathLonLat) polylineRef.current?.setPathLonLat(pathLonLat)
            }
        }
    }, [path]);


    const isCSSColor = (value: any): value is CSSColor => {
        return typeof value === 'string' || Array.isArray(value);
    };

    const isCSSColorArray = (arr: any): arr is CSSColor[][] => {
        return Array.isArray(arr) && arr.every(
            subArr => Array.isArray(subArr) && subArr.every(isCSSColor)
        );
    };

    const isSegmentPathColorArray = (arr: any): arr is  IPolylineParams['pathColors'] => {
        return Array.isArray(arr) && arr.every(
            subArr => Array.isArray(subArr) && subArr.every(
                item => Array.isArray(item) && item.length === 4 && item.every(num => typeof num === 'number')
            )
        );
    };

    const convertPathColors = (pathColors: CSSColor[][] | IPolylineParams['pathColors']): IPolylineParams['pathColors'] => {
        if (isCSSColorArray(pathColors)) {
            return pathColors.map(path => path.map((c) => {
                const vec4Color = htmlColorToRgba(c as CSSColor); // необходимо приведение типа
                return [vec4Color.x, vec4Color.y, vec4Color.z, vec4Color.w];
            }));
        }
        return pathColors as IPolylineParams['pathColors']; // или обработайте как SegmentPathColor[]
    };

    useEffect(() => {
        if (pathColors && Array.isArray(pathColors) && pathColors.length > 0) {
            if (isCSSColorArray(pathColors)) {
                const convertedPathColors = convertPathColors(pathColors);
                if (convertedPathColors) polylineRef.current?.setPathColors(convertedPathColors);
            } else if (isSegmentPathColorArray(pathColors)) {
                polylineRef.current?.setPathColors(pathColors);
            }
        }
    }, [pathColors]);

    useEffect(() => {
        polylineRef.current = new GlobusPolyline({
            ...params,
            color,
            visibility,
            opacity,
            thickness,
            pathLonLat: path ? isPathLonLat(path) ? path : undefined : undefined,
            path3v: path ? isPathv3(path) ? path : undefined : undefined,
            pathColors: convertPathColors(pathColors),
            altitude,
        });
        if (polylineRef.current && _addPolyline) {
            _addPolyline(polylineRef.current);
        }

        return () => {
            if (polylineRef.current && _removePolyline) {
                _removePolyline(polylineRef.current);
            }
        };
    }, [_addPolyline, _removePolyline]);

    return null;
};

export {Polyline};
