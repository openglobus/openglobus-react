import {useEffect, useRef} from 'react';
import {useGlobusContext} from '@/Globe';
import {GeoVideo as GlobusGeoVideo, IGeoVideoParams} from '@openglobus/og';

export interface GeoVideoProps extends IGeoVideoParams {
    name: string;
    children?: never;
}

const GeoVideo: React.FC<GeoVideoProps> = ({name, ...rest}) => {
    const {globus} = useGlobusContext();
    const geoVideoRef = useRef<GlobusGeoVideo | null>(null);

    useEffect(() => {
        if (typeof rest.src === 'string' && geoVideoRef.current) {
            geoVideoRef.current?.setSrc(rest.src)
            // geoVideoRef.current?.setCorners(rest.corners)
        }
    }, [rest.src]);

    useEffect(() => {
        if (globus) {
            geoVideoRef.current = new GlobusGeoVideo(name, rest);
            globus.planet.addLayer(geoVideoRef.current);

            return () => {
                geoVideoRef.current && globus.planet.removeLayer(geoVideoRef.current);
            };
        }
    }, [globus]);

    return null;
};

export {GeoVideo};