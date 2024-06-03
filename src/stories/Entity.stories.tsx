import type {Meta, StoryObj} from '@storybook/react';

import {Entity, EntityProps} from '../Entity';
import {Globus} from "../Globe";
import {Vector} from "../Vector";
import React from 'react';
import {Billboard} from "../entity";
import {GlobusContextProvider} from "../GlobeContext";

const meta = {
    component: Entity,
} satisfies Meta<typeof Entity>;

export default meta;

type Story = StoryObj<typeof meta>;

// export const Default: Story = {};


export const Default: Story = {
    args: {
        lon: 10, lat: 10, alt: 100000
    },
    render: (args: EntityProps) => <GlobusContextProvider>
        <Globus atmosphereEnabled={false}>
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
        </Globus>
    </GlobusContextProvider>
};

// export const Default = (args: BillboardParams) =>
