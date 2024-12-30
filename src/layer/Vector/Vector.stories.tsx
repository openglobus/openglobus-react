import type {Meta, StoryObj} from '@storybook/react';

import {Vector, VectorProps} from './Vector';
import {Default as LayerDefault} from '../Layer/Layer.stories';
import {Billboard, Entity} from "@/entity";
import {Globe, GlobeContextProvider} from "@/Globe";
import {action} from '@storybook/addon-actions';
import React from "react";

const meta = {
    title: 'Components/Layer/Vector',
    component: Vector,
} satisfies Meta<typeof Vector>;

export default meta;

type Story = StoryObj<typeof meta>;


export const Default: Story = {
    parameters: {
        actions: {depth: 1, maxDepth: 1},
    },
    argTypes:{
        ...LayerDefault.argTypes
    },
    args: {
        name: 'test',
        opacity: 1
    },
    render: (args: VectorProps) => <GlobeContextProvider>
        <Globe>
            <Vector {...args}>
                <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                    <Billboard
                        size={[96, 96]}
                        color={"#ff5959"}
                        src={'https://sandbox.openglobus.org/examples/billboards/carrot.png'}
                    />
                </Entity>
            </Vector>
        </Globe>
    </GlobeContextProvider>
};

