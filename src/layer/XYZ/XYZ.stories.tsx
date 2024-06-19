import type {Meta, StoryObj} from '@storybook/react';


import {Globe, GlobeContextProvider} from "@/Globe";
import React from "react";
import {XYZ, XYZProps} from "@/layer/XYZ/XYZ";
import {utils} from "@openglobus/og";

const meta = {
    title: 'Components/Layer/XYZ',
    component: XYZ,
} satisfies Meta<typeof XYZ>;

export default meta;

type Story = StoryObj<typeof meta>;


function toQuadKey(x: number, y: number, z: number): string {
    var index = '';
    for (var i = z; i > 0; i--) {
        var b = 0;
        var mask = 1 << (i - 1);
        if ((x & mask) !== 0) b++;
        if ((y & mask) !== 0) b += 2;
        index += b.toString();
    }
    return index;
}
export const OpenStreetMap: Story = {

    args: {
        name: 'osm',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    render: (args: XYZProps) => <GlobeContextProvider>
        <Globe>
            <XYZ {...args} />
        </Globe>
    </GlobeContextProvider>
};

export const Satellites: Story = {
    args: {
        name: 'sat',
        url: 'https://ecn.{s}.tiles.virtualearth.net/tiles/a{quad}.jpeg?n=z&g=7146',
        subdomains: ['t0', 't1', 't2', 't3'],
        urlRewrite: function (s: any, u: string) {
            console.log(s)
            return utils.stringTemplate(u, {s: ['t0', 't1', 't2', 't3'][Math.round(Math.random() * 3)], quad: toQuadKey(s.tileX, s.tileY, s.tileZoom)});
        }
    },
    render: (args: XYZProps) =>
        <GlobeContextProvider>
            <Globe>
                <XYZ {...args} />
            </Globe>
        </GlobeContextProvider>
}

