import { useEffect } from 'react';
import { useGlobusContext } from './index';
// @ts-ignore
import { ILayerParams, Layer as GlobusLayer } from '@openglobus/og';

const Layer = ({ layer }: { layer: ILayerParams }) => {
    const { globus } = useGlobusContext();

    useEffect(() => {
        if (globus) {
            const newLayer = new GlobusLayer(layer.name, layer);
            globus.planet.addLayer(newLayer);

            return () => {
                globus.planet.removeLayer(newLayer);
            };
        }
    }, [globus]);

    return null;
};

export {Layer};

