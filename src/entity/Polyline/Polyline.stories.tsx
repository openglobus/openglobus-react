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
        pathColors: [["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"]],
        path: [
            [
                [0, 0, 10000],
                [0.2, 0.2, 15000],
                [0.4, 0.4, 20000],
                [0.6, 0.6, 25000],
                [0.8, 0.8, 20000],
                [1, 1, 15000],
                [1.2, 1.2, 10000]
            ]
        ]
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