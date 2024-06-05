import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Entity, GeoObject, GeoObjectParams} from '@/entity';
import {Globus, GlobusContextProvider} from "@/Globe";
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
    render: (args: GeoObjectParams) => <GlobusContextProvider>
        <Globus atmosphereEnabled={false}>
            <Vector name={'test'}
                    scaleByDistance={[100, 4000000, 1]}>
                <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                    <GeoObject
                        {...args}
                    />
                </Entity>
            </Vector>
        </Globus>
    </GlobusContextProvider>
};
export const Untextured: Story = {
    args: {
        ...Default.args,
        textureSrc: undefined
    },
    render: (args: GeoObjectParams) => <GlobusContextProvider>
        <Globus atmosphereEnabled={false}>
            <Vector name={'test'}
                    scaleByDistance={[100, 4000000, 1]}>
                <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                    <GeoObject
                        {...args}
                    />
                </Entity>
            </Vector>
        </Globus>
    </GlobusContextProvider>
};

// export const Default = (args: BillboardParams) =>
