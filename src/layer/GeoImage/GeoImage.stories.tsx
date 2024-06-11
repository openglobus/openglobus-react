import type {Meta, StoryObj} from '@storybook/react';


import {Globus, GlobusContextProvider} from "@/Globe";
import React from "react";
import {GeoImage, GeoImageProps} from "@/layer/GeoImage";

const meta = {
    title: 'Components/Layer/GeoImage',
    component: GeoImage,
} satisfies Meta<typeof GeoImage>;

export default meta;

type Story = StoryObj<typeof meta>;


export const Kilimanjaro: Story = {
    parameters: {
        actions: {depth: 1, maxDepth: 1},
    },
    args: {
        name: 'Kilimanjaro',
        src: 'https://openglobus.org/examples/examples/geoImage/SPOT%207%20Satellite%20Image%20Kilimanjaro.jpg',
        corners:  [[37.286664453664194, -3.0473247187887442], [37.38444113753977, -3.0468478037959073], [37.384014813048736, -3.0904441121085506], [37.29373990291454, -3.09380219219323]]
        // onDraw: action('onDraw', {depth: 1, maxDepth: 1}),
    },
    render: (args: GeoImageProps) => <GlobusContextProvider>
        <Globus atmosphereEnabled={false}>
            <GeoImage {...args} />
        </Globus>
    </GlobusContextProvider>
};

export const Italy: Story = {
    args: {
        name: 'Italy',
        src: 'https://openglobus.org/examples/examples/geoImageDragging/001m--l32.jpg',
        corners:[[5.635392096391909, 48.12285230763866], [12.40298532820745, 48.11462482358326], [12.214647470795295, 43.81172338809331], [5.805669171925254, 43.97030327540555]],
    },
    render: (args: GeoImageProps) => <GlobusContextProvider>
        <Globus>
            <GeoImage {...args} />
        </Globus>
    </GlobusContextProvider>
}

