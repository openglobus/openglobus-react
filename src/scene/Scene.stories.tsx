import type {Meta, StoryObj} from '@storybook/react-vite';
import React from 'react';
import {Renderer, ActiveCamera} from '@/renderer';
import {Entity, EntityCollection, Gltf} from '@/entity';
import {Axes, Scene} from '@/scene';

const meta = {
    title: 'Components/Scene/Scene',
    component: Scene,
    args: {
        name: 'model-scene',
        visible: true
    }
} satisfies Meta<typeof Scene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <Renderer>
            <ActiveCamera position={[30, 30, 30]} target={[0, 0, 0]}/>
            <Axes/>
            <Scene {...args}>
                <EntityCollection>
                    <Entity name="maxwell">
                        <Gltf src="/story-assets/glb/maxwell_the_cat.glb"/>
                    </Entity>
                </EntityCollection>
            </Scene>
        </Renderer>
    )
};
