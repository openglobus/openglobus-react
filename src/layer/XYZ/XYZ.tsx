import {useEffect, useRef} from 'react';
import {useGlobusContext} from '@/Globe';
import {IXYZParams, XYZ as GlobusXYZ} from '@openglobus/og';

export interface XYZProps extends IXYZParams {
    name: string;
    children?: never;
}

const XYZ: React.FC<XYZProps> = ({name, ...rest}) => {
    const {globus} = useGlobusContext();
    const xyzRef = useRef<GlobusXYZ | null>(null);
    //
    useEffect(() => {
        if (typeof rest.url === 'string' && xyzRef.current) {
            xyzRef.current?.setUrl(rest.url)
        }
    }, [rest.url]);

    useEffect(() => {
        if (globus) {
            xyzRef.current = new GlobusXYZ(name, {...rest});
            globus.planet.addLayer(xyzRef.current);

            return () => {
                xyzRef.current && globus.planet.removeLayer(xyzRef.current);
            };
        }
    }, [globus]);

    return null;
};

export {XYZ};