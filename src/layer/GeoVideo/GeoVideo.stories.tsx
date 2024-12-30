import type {Meta, StoryObj} from '@storybook/react';


import {Globe, GlobeContextProvider} from "@/Globe";
import React from "react";
import {GeoVideo, GeoVideoProps} from "@/layer/GeoVideo";

const meta = {
    title: 'Components/Layer/GeoVideo',
    component: GeoVideo,
} satisfies Meta<typeof GeoVideo>;

export default meta;

type Story = StoryObj<typeof meta>;


export const USAWeather: Story = {
    parameters: {
        actions: {depth: 1, maxDepth: 1},
    },
    args: {
        name: 'test',
        src: 'https://sandbox.openglobus.org/examples/geoVideo/imergac_20160508_NASA.mp4',
        corners: [[-134.7904382939764, 55.07955352950936], [-54.984314759410594, 54.98843914299802], [-55.041854075913825, 19.820153025849297], [-134.89882012831265, 19.631495126944017]],
        // onDraw: action('onDraw', {depth: 1, maxDepth: 1}),
    },
    render: (args: GeoVideoProps) => <GlobeContextProvider>
        <Globe>
            <GeoVideo {...args} />
        </Globe>
    </GlobeContextProvider>
};

export const Vegas: Story = {
    args: {
        name: 'vegas',
        src: 'https://sandbox.openglobus.org/examples/geoVideo/SkyBox-LasVegas.mp4',
        corners:[[-115.18254616355969, 36.110055739189924], [-115.16604079376724, 36.10771264333345], [-115.16801916927308, 36.10038576099672], [-115.18457379699841, 36.102812078782755]]
        // onDraw: action('onDraw', {depth: 1, maxDepth: 1}),
    },
    render: (args: GeoVideoProps) => <GlobeContextProvider>
        <Globe>
            <GeoVideo {...args} />
        </Globe>
    </GlobeContextProvider>
}

