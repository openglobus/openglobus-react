import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Entity, Polyline, PolylineParams} from '@/entity';
import {Globus, GlobusContextProvider} from "@/Globe";
import {Vector} from "@/layer";

const meta = {
    component: Polyline,
    title: 'Components/Entity/Polyline',
} satisfies Meta<typeof Polyline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        color: "#053df3",
        visibility: true,
        altitude: 0,
        thickness: 1.5,
        opacity: 1,
        pathColors: [["#f305c3"], ["#5cf305", "#fb0145", "#003afb"]],
        path: [[[0, 0, 10000], [0, 1, 10000], [1, 1, 10000], [1, 0, 10000]]],
    },
    render: (args: PolylineParams) => {
        return <GlobusContextProvider>
            <Globus atmosphereEnabled={false}
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Polyline
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globus>
        </GlobusContextProvider>;
    }
};