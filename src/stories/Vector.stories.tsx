import type {Meta, StoryObj} from '@storybook/react';

import {Vector, VectorProps} from '../layer/Vector';
import {Billboard} from "../entity";
import {GlobusContextProvider} from "../GlobeContext";
import {action} from '@storybook/addon-actions';

import {Globus} from "../Globe";
import {Entity} from "../entity/Entity";
import React from "react";

const meta = {
  component: Vector,
} satisfies Meta<typeof Vector>;

export default meta;

type Story = StoryObj<typeof meta>;


export const Default: Story = {
    parameters: {
        actions: {depth: 1, maxDepth: 1},
    },
    args: {
        name: 'test',
        onMouseEnter: action('onMouseEnter', {depth: 1, maxDepth: 1}),
        // onDraw: action('onDraw', {depth: 1, maxDepth: 1}),
    },
    render: (args: VectorProps) => <GlobusContextProvider>
        <Globus atmosphereEnabled={false}>
            <Vector {...args}>
                <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                    <Billboard
                        size={[96, 96]}
                        color={"#ff5959"}
                        src={'https://openglobus.org/examples/examples/billboards/carrot.png'}
                    />
                </Entity>
            </Vector>
        </Globus>
    </GlobusContextProvider>
};

