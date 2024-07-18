import {useEffect, useRef} from 'react';
import {useGlobeContext} from '@/Globe';
import {IXYZParams, XYZ as GlobusXYZ} from '@openglobus/og';

export interface XYZProps extends IXYZParams {
    name: string;
    children?: never;
}

const XYZ: React.FC<XYZProps> = ({name, ...rest}) => {
    const {globe} = useGlobeContext();
    const xyzRef = useRef<GlobusXYZ | null>(null);

    useEffect(() => {
        if (typeof rest.opacity === 'number' && xyzRef.current) {
            if (xyzRef.current) {
                xyzRef.current.opacity = rest.opacity;
            }
        }
    }, [rest.opacity]);

    //
    useEffect(() => {
        if (typeof rest.url === 'string' && xyzRef.current) {
            xyzRef.current?.setUrl(rest.url)
        }
    }, [rest.url]);

    useEffect(() => {
        if (globe) {
            xyzRef.current = new GlobusXYZ(name, {...rest});
            globe.planet.addLayer(xyzRef.current);

            return () => {
                xyzRef.current && globe.planet.removeLayer(xyzRef.current);
            };
        }
    }, [globe]);

    return null;
};

export {XYZ};