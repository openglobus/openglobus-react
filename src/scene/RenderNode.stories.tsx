import type {Meta, StoryObj} from '@storybook/react-vite';
import React from 'react';
import {Renderer} from '@/renderer/Renderer';
import {RenderNode} from './RenderNode';
import {Entity, Gltf} from "@/entity";
import { EntityCollection } from "@/entity/EntityCollection";
import {ActiveCamera} from "@/renderer";
import {Axes} from "@/scene";

const meta = {
    title: 'Components/Scene/RenderNode',
    component: RenderNode,

} satisfies Meta<typeof RenderNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => <Renderer onDraw={() => console.log('draw frame')}>
        <ActiveCamera position={[30, 30, 30]} target={[0, 0, 0]} />
        <Axes/>
        <RenderNode >
            <EntityCollection >
                <Entity name="maxwell">
                    <Gltf src='/story-assets/glb/maxwell_the_cat.glb'/>
                </Entity>
            </EntityCollection>
        </RenderNode>
    </Renderer>
};