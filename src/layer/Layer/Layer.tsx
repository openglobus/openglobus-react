import {useEffect} from 'react';
import {useGlobeContext} from '@/Globe';
import {ILayerParams, Layer as GlobusLayer} from '@openglobus/og';

const Layer = ({props, name}: { props: ILayerParams, name: string }) => {
    const {globe} = useGlobeContext();

    useEffect(() => {
        if (globe) {
            const newLayer = new GlobusLayer(name, props);
            globe.planet.addLayer(newLayer);

            return () => {
                globe.planet.removeLayer(newLayer);
            };
        }
    }, [globe]);

    return null;
};

export {Layer};

