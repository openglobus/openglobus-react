import React from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';

import {Globe, GlobeContextProvider} from "@/Globe";
import {Billboard, BillboardParams, Entity} from '@/entity';
import {Vector} from "@/layer";

/**
 * This story about Billboard component. Billboard is a component that represents a 2d object which always faced to camera.
 */
const meta = {
    component: Billboard,
    title: 'Components/Entity/Billboard',
} satisfies Meta<typeof Billboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    argTypes: {
        src: {
            description: 'URL of the image',
            required: true,
            control: {
                type: 'text'
            }
        },
        size: {
            description: 'Size of the billboard in pixels',
            defaultValue: [30, 30],
        },
        color: {
            description: 'Color of the billboard',
            table: {
                defaultValue: {summary: 'white'}
            },
        },
        rotation: {
            description: 'Rotation of the billboard in radians',
            table: {
                defaultValue: {summary: '0'}
            },
            control: {
                type: 'range',
                min: 0,
                max: 360
            }
        },
        offset: {
            description: 'Offset of the billboard in pixels',
            defaultValue: [0, 0, 0],
            table: {
                type: {summary: '[number, number, number]'},
                defaultValue: {summary: '[0, 0, 0]'},
            }
        },
        visibility: {
            description: 'Visibility of the billboard',
            defaultValue: true,
            control: {
                type: 'boolean'
            }
        }
    },
    args: {
        size: [96, 96],
        color: "#ff5959",
        src: 'https://sandbox.openglobus.org/examples/billboards/carrot.png',
        rotation: 0,
        offset: [0, 0, 0],
        visibility: true,
    },
    render: (args: BillboardParams) => <GlobeContextProvider>
        <Globe>
            <Vector name={'test'}
                    scaleByDistance={[6000000, 24000000, 10000000000]}>
                <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                    <Billboard
                        {...args}
                    />
                </Entity>
            </Vector>
        </Globe>
    </GlobeContextProvider>
};

export const  DifferentSrc: Story = {
    args:{
        ...Default.args,
        src: 'https://png.pngtree.com/png-clipart/20230414/ourmid/pngtree-star-clipart-png-image_6705223.png'
    },
    argTypes: {
        ...Default.argTypes
    },
    render: Default.render
}