import {useEffect, useRef} from 'react';
import {useGlobeContext} from '@/Globe';
import {GeoVideo as GlobusGeoVideo, IGeoVideoParams} from '@openglobus/og';

export interface GeoVideoProps extends IGeoVideoParams {
    name: string;
    children?: never;
}

const GeoVideo: React.FC<GeoVideoProps> = ({name, ...rest}) => {
    const {globe} = useGlobeContext();
    const geoVideoRef = useRef<GlobusGeoVideo | null>(null);

    useEffect(() => {
        if (typeof rest.src === 'string' && geoVideoRef.current) {
            geoVideoRef.current?.setSrc(rest.src)
            // geoVideoRef.current?.setCorners(rest.corners)
        }
    }, [rest.src]);

    useEffect(() => {
        if (globe) {
            geoVideoRef.current = new GlobusGeoVideo(name, rest);
            globe.planet.addLayer(geoVideoRef.current);

            return () => {
                geoVideoRef.current && globe.planet.removeLayer(geoVideoRef.current);
            };
        }
    }, [globe]);

    return null;
};

export {GeoVideo};