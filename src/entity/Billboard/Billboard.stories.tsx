import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Globus, GlobusContextProvider} from "@/Globe";
import {Billboard, BillboardParams, Entity} from '@/entity';
import {Vector} from "@/layer";

const meta = {
    component: Billboard,
    title: 'Components/Entity/Billboard',
} satisfies Meta<typeof Billboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        size: [96, 96],
        color: "#ff5959",
        src: 'https://openglobus.org/examples/examples/billboards/carrot.png',
        rotation: 0,
        offset: [0, 0, 0],
        visibility: true,
    },
    render: (args: BillboardParams) => <GlobusContextProvider>
        <Globus atmosphereEnabled={false}>
            <Vector name={'test'}
                    scaleByDistance={[6000000, 24000000, 10000000000]}>
                <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                    <Billboard
                        {...args}
                    />
                </Entity>
            </Vector>
        </Globus>
    </GlobusContextProvider>
};