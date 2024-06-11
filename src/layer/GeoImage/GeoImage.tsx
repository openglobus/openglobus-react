import {useEffect, useRef} from 'react';
import {useGlobusContext} from '@/Globe';
import {GeoImage as GlobusGeoImage, IGeoImageParams} from '@openglobus/og';

export interface GeoImageProps extends IGeoImageParams {
    name: string;
    children?: never;
}

const GeoImage: React.FC<GeoImageProps> = ({name, ...rest}) => {
    const {globus} = useGlobusContext();
    const geoImageRef = useRef<GlobusGeoImage | null>(null);

    useEffect(() => {
        if (typeof rest.src === 'string' && geoImageRef.current) {
            geoImageRef.current?.setSrc(rest.src)
        }
    }, [rest.src]);

    useEffect(() => {
        if (globus) {
            geoImageRef.current = new GlobusGeoImage(name, rest);
            globus.planet.addLayer(geoImageRef.current);

            return () => {
                geoImageRef.current && globus.planet.removeLayer(geoImageRef.current);
            };
        }
    }, [globus]);

    return null;
};

export {GeoImage};