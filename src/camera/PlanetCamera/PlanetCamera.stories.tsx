import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Globe, GlobeContextProvider} from "@/Globe";
import {PlanetCamera, PlanetCameraParams} from "@/camera/PlanetCamera/PlanetCamera";

/**
 * This story about Billboard component. Billboard is a component that represents a 2d object which always faced to camera.
 */
const meta = {
    component: PlanetCamera,
    title: 'Components/Camera/PlanetCamera',
} satisfies Meta<typeof PlanetCamera>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: {
    args: PlanetCameraParams
    render: (args: PlanetCameraParams) => React.JSX.Element
} = {

    args: {
        lon: 0,
        lat: 0,
        alt: 100000,
        lookLon: 10,
        lookLat: 10,
        lookAlt: 100000,
        viewAngle:47
    },
    render: (args: PlanetCameraParams) => <GlobeContextProvider>
        <Globe>
            <PlanetCamera {...args} />
        </Globe>
    </GlobeContextProvider>
};
