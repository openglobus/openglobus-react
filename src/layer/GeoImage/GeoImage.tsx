import {useEffect, useRef} from 'react';
import {useGlobeContext} from '@/Globe';
import {GeoImage as GlobusGeoImage, IGeoImageParams} from '@openglobus/og';

export interface GeoImageProps extends IGeoImageParams {
    name: string;
    children?: never;
}

const GeoImage: React.FC<GeoImageProps> = ({name, ...rest}) => {
    const {globe} = useGlobeContext();
    const geoImageRef = useRef<GlobusGeoImage | null>(null);

    useEffect(() => {
        if (typeof rest.src === 'string' && geoImageRef.current) {
            geoImageRef.current?.setSrc(rest.src)
        }
    }, [rest.src]);

    useEffect(() => {
        if (globe) {
            geoImageRef.current = new GlobusGeoImage(name, rest);
            globe.planet.addLayer(geoImageRef.current);

            return () => {
                geoImageRef.current && globe.planet.removeLayer(geoImageRef.current);
            };
        }
    }, [globe]);

    return null;
};

export {GeoImage};