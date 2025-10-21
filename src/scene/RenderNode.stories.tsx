import type {Meta, StoryObj} from '@storybook/react-vite';
import React from 'react';
import {Renderer} from '@/renderer/Renderer';
import {RenderNode} from './RenderNode';
import {Entity, Gltf} from "@/entity";
import { EntityCollection } from "@/entity/EntityCollection";

const meta = {
    title: 'Components/Renderer/RenderNode',
    component: RenderNode,
    parameters: {
        layout: 'fullscreen'
    },
    argTypes: {
        name: {
            description: 'Optional name for the RenderNode',
            control: 'text',
            table: {defaultValue: {summary: 'unnamed'}}
        },
        visible: {
            description: 'Visibility toggle',
            control: 'boolean',
            table: {defaultValue: {summary: 'true'}}
        }
    }
} satisfies Meta<typeof RenderNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => <Renderer onDraw={() => console.log('draw frame')}>
        <RenderNode name="TestNode" onDraw={() => console.log('node draw')}>
            <EntityCollection >
                <Entity name="maxwell">
                    <Gltf src='https://openglobus.github.io/storybook/story-assets/maxwell_the_cat.glb'/>
                </Entity>
            </EntityCollection>
        </RenderNode>
    </Renderer>,
    args: {
        name: 'DemoNode',
        visible: true
    }
};