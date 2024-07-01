import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Entity, Geometry, GeometryParams} from '@/entity';
import {Globe, GlobeContextProvider} from "@/Globe";
import {Vector} from "@/layer";

const meta = {
    component: Geometry,
    title: 'Components/Entity/Geometry',
} satisfies Meta<typeof Geometry>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Polygon: Story = {
    args: {
        fillColor: "#053df3",
        strokeColor: "#33fa07",
        lineColor: "#f205be",
        lineWidth: 2,
        strokeWidth: 2,
        type: 'POLYGON',
        coordinates: [[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]],
        visibility: true,
    },
    render: (args: GeometryParams) => {
        return <GlobeContextProvider>
            <Globe
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Geometry
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globe>
        </GlobeContextProvider>;
    }
};
export const Point: Story = {
    args: {
        fillColor: "#053df3",
        strokeColor: "#33fa07",
        lineColor: "#053df3",
        lineWidth: 20,
        type: 'POINT',
        coordinates: [0.0, 0.0],
        visibility: true,
    },
    render: (args: GeometryParams) => {
        return <GlobeContextProvider>
            <Globe
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Geometry
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globe>
        </GlobeContextProvider>;
    }
}
export const Line: Story = {
    args: {
        lineColor: "#053df3",
        lineWidth: 2,
        type: 'LINESTRING',
        coordinates: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]],
        visibility: true,
    },
    render: (args: GeometryParams) => {
        return <GlobeContextProvider>
            <Globe
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Geometry
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globe>
        </GlobeContextProvider>;
    }
}
