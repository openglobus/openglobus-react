import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Entity, Strip, StripParams} from '@/entity';
import {Globus, GlobusContextProvider} from "@/Globe";
import {Vector} from "@/layer";
import {Ellipsoid, LonLat} from '@openglobus/og';

const meta = {
    component: Strip,
    title: 'Components/Entity/Strip',
} satisfies Meta<typeof Strip>;

export default meta;

type Story = StoryObj<typeof meta>;

function getLeaf(startPoi: LonLat, endPoi: LonLat, maxHeight = 2000000, n = 10) {
    let path = [];
    for (let i = 0; i <= n; i++) {
        let p0 = Ellipsoid.getIntermediatePointOnGreatCircle(startPoi, endPoi, i / n);
        let height = Math.sin(i / n * Math.PI) * maxHeight;
        let p1 = new LonLat(p0.lon, p0.lat, height);
        path.push([p0, p1]);
    }
    return path;
}

export const Default: Story = {
    args: {
        color: "#053df3",
        visibility: true,
        opacity: 1,
        path: getLeaf(new LonLat(0, 90), new LonLat(90, 0)).map((arr) => arr.map(ll => [ll.lon, ll.lat, ll.height])) as []
    },
    render: (args: StripParams) => {
        return <GlobusContextProvider>
            <Globus atmosphereEnabled={false}
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Strip
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globus>
        </GlobusContextProvider>;
    }
};