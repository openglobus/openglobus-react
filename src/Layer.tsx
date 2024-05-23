import { useEffect } from 'react';
import { useGlobusContext } from './index';
import { ILayerParams, Layer as GlobusLayer } from '@openglobus/og';

const Layer = ({ props, name }: { props: ILayerParams,name: string }) => {
    const { globus } = useGlobusContext();

    useEffect(() => {
        if (globus) {
            const newLayer = new GlobusLayer(name, props);
            globus.planet.addLayer(newLayer);

            return () => {
                globus.planet.removeLayer(newLayer);
            };
        }
    }, [globus]);

    return null;
};

export {Layer};

