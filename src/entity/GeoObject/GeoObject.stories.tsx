import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Entity, GeoObject, GeoObjectParams} from '@/entity';
import {Globe, GlobeContextProvider} from "@/Globe";
import {Vector} from "@/layer";

const meta = {
    component: GeoObject,
    title: 'Components/Entity/GeoObject',
} satisfies Meta<typeof GeoObject>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        visibility: true,
        yaw: 0,
        roll: 0,
        pitch: 0,
        scale: 10,
        tag: 'none',
        color: 'red',
        objSrc: 'https://raw.githubusercontent.com/pavletto/og_resources/main/geo_object/penguin.obj',
        textureSrc: 'https://raw.githubusercontent.com/pavletto/og_resources/main/geo_object/penguin.png',
    },
    render: (args: GeoObjectParams) => <GlobeContextProvider>
        <Globe>
            <Vector name={'test'}
                    scaleByDistance={[100, 4000000, 1]}>
                <Entity name="Custom Entity" lon={0} lat={0} alt={0} yaw={args.yaw} roll={args.roll} pitch={args.pitch}>
                    <GeoObject
                        {...args}
                    />
                </Entity>
            </Vector>
        </Globe>
    </GlobeContextProvider>
};
export const Untextured: Story = {
    args: {
        ...Default.args,
        textureSrc: undefined
    },
    render: (args: GeoObjectParams) => <GlobeContextProvider>
        <Globe>
            <Vector name={'test'}
                    scaleByDistance={[100, 4000000, 1]}>
                <Entity name="Custom Entity" lon={0} lat={0} alt={0} yaw={args.yaw} roll={args.roll} pitch={args.pitch}>
                    <GeoObject
                        {...args}
                    />
                </Entity>
            </Vector>
        </Globe>
    </GlobeContextProvider>
};

export const Barrel: Story = {
    args: {
        ...Default.args,
        textureSrc: 'https://raw.githubusercontent.com/PrincessGod/objTo3d-tiles/master/bin/barrel/barrel.png',
        objSrc: 'https://raw.githubusercontent.com/PrincessGod/objTo3d-tiles/master/bin/barrel/barrel.obj'
    },
    render: (args: GeoObjectParams) => <GlobeContextProvider>
        <Globe>
            <Vector name={'test'}
                    scaleByDistance={[100, 4000000, 1]}>
                <Entity name="Custom Entity" lon={0} lat={0} alt={0} yaw={args.yaw} roll={args.roll} pitch={args.pitch}>
                    <GeoObject
                        {...args}
                    />
                </Entity>
            </Vector>
        </Globe>
    </GlobeContextProvider>
};

// export const Default = (args: BillboardParams) =>
