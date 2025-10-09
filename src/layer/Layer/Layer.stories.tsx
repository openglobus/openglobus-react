import type {Meta, StoryObj} from '@storybook/react-vite';

import {Billboard, Entity} from "@/entity";
import {Globe, GlobeContextProvider} from "@/Globe";
import {action} from 'storybook/actions';
import React from "react";
import {Layer, Vector, VectorProps} from "@/layer";

const meta = {
    title: 'Components/Layer/Layer',
    component: Layer,
} satisfies Meta<typeof Layer>;

export default meta;

type Story = StoryObj<typeof meta>;


export const Default: Story = {
    parameters: {
        actions: {depth: 1, maxDepth: 1},
    },
    argTypes: {
        onVisibilityChange: {table: {disable: true}},
        onAdd: {table: {disable: true}},
        onRemove: {table: {disable: true}},
        onMouseMove: {table: {disable: true}},
        onMouseEnter: {table: {disable: true}},
        onMouseLeave: {table: {disable: true}},
        onLclick: {table: {disable: true}},
        onRclick: {table: {disable: true}},
        onMclick: {table: {disable: true}},
        onLdblclick: {table: {disable: true}},
        onRdblclick: {table: {disable: true}},
        onMdblclick: {table: {disable: true}},
        onLup: {table: {disable: true}},
        onRup: {table: {disable: true}},
        onMup: {table: {disable: true}},
        onLdown: {table: {disable: true}},
        onRdown: {table: {disable: true}},
        onMdown: {table: {disable: true}},
        onLhold: {table: {disable: true}},
        onRhold: {table: {disable: true}},
        onMhold: {table: {disable: true}},
        onMouseWheel: {table: {disable: true}},
        onTouchMove: {table: {disable: true}},
        onTouchStart: {table: {disable: true}},
        onTouchEnd: {table: {disable: true}},
        onDoubleTouch: {table: {disable: true}},
        onTouchLeave: {table: {disable: true}},
        onTouchEnter: {table: {disable: true}},
    },
    args: {
        name: 'test',
        onMouseEnter: action('onMouseEnter', {depth: 1, maxDepth: 1}),
        onLclick: action('onLclick', {depth: 1, maxDepth: 1}),
        onMouseLeave: action('onMouseLeave', {depth: 1, maxDepth: 1}),
        onMouseMove: action('onMouseMove', {depth: 1, maxDepth: 1}),
        onLdblclick: action('onLdblclick', {depth: 1, maxDepth: 1}),
        // onDraw: action('onDraw', {depth: 1, maxDepth: 1}),
    },
    //@ts-ignore
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

