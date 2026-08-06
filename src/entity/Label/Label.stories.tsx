import React from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';

import {PlanetCamera} from "@/camera/PlanetCamera/PlanetCamera";
import {Entity, Label, LabelParams} from '@/entity';
import {Globe, GlobeContextProvider} from "@/Globe";
import {Vector} from "@/layer";

const FONTS_SRC = "./story-assets/fonts";

const meta = {
    component: Label,
    title: 'Components/Entity/Label',
    argTypes: {
        face: {
            options: ['Roboto-Regular'],
            control: {type: 'select'},
        }
    }
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        color: "#053df3",
        outlineColor: "#33fa07",
        rotation: 0,
        face: 'Roboto-Regular',
        align: 'center',
        opacity: 1,
        size: 32,
        outline: 0.2,
        text: "Hello, World!",
        offset: [0, 0],
        visibility: true,
        isRTL: false,
    },
    render: (args: LabelParams) => {
        return <GlobeContextProvider>
            <Globe fontsSrc={FONTS_SRC}>
                <PlanetCamera
                    lon={1}
                    lat={1}
                    alt={100000}
                    lookLon={0}
                    lookLat={0}
                    lookAlt={0}
                />
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Label {...args}/>
                    </Entity>
                </Vector>
            </Globe>
        </GlobeContextProvider>;
    }
};
