import type {Meta, StoryObj} from '@storybook/react';


import {Globus, GlobusContextProvider} from "@/Globe";
import React from "react";
import {XYZ, XYZProps} from "@/layer/XYZ/XYZ";

const meta = {
    title: 'Components/Layer/XYZ',
    component: XYZ,
} satisfies Meta<typeof XYZ>;

export default meta;

type Story = StoryObj<typeof meta>;


export const OpenStreetMap: Story = {

    args: {
        name: 'osm',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    render: (args: XYZProps) => <GlobusContextProvider>
        <Globus atmosphereEnabled={false}>
            <XYZ {...args} />
        </Globus>
    </GlobusContextProvider>
};

export const Satellites: Story = {
    args: {
        name: 'sat',
        url: 'https://ecn.{s}.tiles.virtualearth.net/tiles/a{quad}.jpeg?n=z&g=7146'
    },
    render: (args: XYZProps) => <GlobusContextProvider>
        <Globus atmosphereEnabled={false}>
            <XYZ {...args} />
        </Globus>
    </GlobusContextProvider>
}

