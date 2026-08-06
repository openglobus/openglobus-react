import React, {useEffect} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {control, LonLat, Object3d, Vec3} from '@openglobus/og';

import {Entity} from '@/entity';
import {Globe, GlobeContextProvider, useGlobeContext} from '@/Globe';
import {Vector} from '@/layer';

const baseObject = Object3d.createCube(0.4, 2, 0.4)
    .translate(new Vec3(0, 1, 0))
    .setColor('#ff5252')
    .setMaterialProperties({
        ambientOcclusion: 1,
        roughness: 0.15,
        metallic: 0.85
    });

const viewObject = Object3d.createFrustum(3, 2, 1)
    .setColor('#1cdd23')
    .setMaterialProperties({
        ambientOcclusion: 1,
        roughness: 0.2,
        metallic: 0.8
    });

const nestedViewObject = Object3d.createFrustum(3, 2, 1)
    .setColor('#ef00ff')
    .setMaterialProperties({
        ambientOcclusion: 1,
        roughness: 0.1,
        metallic: 0.9
    });

const position = new LonLat(-105.6173319876, 39.615583413, 4057.9466);

const ExampleSetup = () => {
    const {globe} = useGlobeContext();

    useEffect(() => {
        if (!globe) return;

        const controls = [
            new control.EntityEditor(),
            new control.OrthoSwitcher(),
            new control.LayerSwitcher()
        ];

        globe.planet.addControls(controls);
        globe.planet.camera.setLonLat(
            new LonLat(-105.61717175714179, 39.61567256262465, 4064.033358156039),
            position
        );
        globe.planet.camera.viewDistance(
            globe.planet.ellipsoid.lonLatToCartesian(position),
            12000
        );

        return () => controls.forEach(item => item.remove());
    }, [globe]);

    return null;
};

const meta = {
    component: Entity,
    title: 'Components/Entity/GeoObject'
} satisfies Meta<typeof Entity>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <GlobeContextProvider>
            <Globe>
                <ExampleSetup/>
                <Vector name="Object hierarchy" scaleByDistance={[50, 50000, 1]}>
                    <Entity
                        name="Base object"
                        lonlat={position}
                        independentPicking
                        geoObject={{
                            tag: 'baseObject',
                            object3d: baseObject
                        }}
                    >
                        <Entity
                            name="View object"
                            cartesian={[0, 1, 0]}
                            relativePosition
                            independentPicking
                            geoObject={{
                                tag: 'viewObject',
                                object3d: viewObject
                            }}
                        >
                            <Entity
                                name="Nested view object"
                                cartesian={[0, 3, -1]}
                                relativePosition
                                independentPicking
                                geoObject={{
                                    tag: 'nestedViewObject',
                                    object3d: nestedViewObject
                                }}
                            />
                        </Entity>
                    </Entity>
                </Vector>
            </Globe>
        </GlobeContextProvider>
    )
};
