import type {Meta, StoryObj} from '@storybook/react';

import {Entity} from '../entity/Entity';
import {Globus} from "../Globe";
import {Vector} from "../layer/Vector";
import React from 'react';
import {Geometry, GeometryParams, Label} from "../entity";
import {GlobusContextProvider} from "../GlobeContext";

const meta = {
    component: Geometry,
    tags: ['autodocs'],
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
        return <GlobusContextProvider>
            <Globus atmosphereEnabled={false}
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Geometry
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globus>
        </GlobusContextProvider>;
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
        return <GlobusContextProvider>
            <Globus atmosphereEnabled={false}
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Geometry
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globus>
        </GlobusContextProvider>;
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
        return <GlobusContextProvider>
            <Globus atmosphereEnabled={false}
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Geometry
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globus>
        </GlobusContextProvider>;
    }
}
