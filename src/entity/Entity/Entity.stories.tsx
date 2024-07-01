import type {Meta, StoryObj} from '@storybook/react';

import {Billboard, Entity, EntityParams} from '@/entity';
import {Globe, GlobeContextProvider} from "@/Globe";
import {Vector} from "@/layer";
import React from 'react';

const meta = {
    component: Entity,
    title: 'Components/Entity/Entity',
} satisfies Meta<typeof Entity>;

export default meta;

type Story = StoryObj<typeof meta>;


export const Default: Story = {
    args: {
        lon: 10, lat: 10, alt: 100000
    },
    render: (args: EntityParams) => <GlobeContextProvider>
        <Globe>
            <Vector name={'test'}
                    scaleByDistance={[6000000, 24000000, 10000000000]}>
                <Entity name="Custom Entity"
                        {...args}>
                    <Billboard
                        size={[96, 96]}
                        color={"#ff5959"}
                        src={'https://openglobus.org/examples/examples/billboards/carrot.png'}
                    />
                </Entity>
            </Vector>
        </Globe>
    </GlobeContextProvider>
};
