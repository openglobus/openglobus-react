import React, {useEffect, useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';

import {Entity, GeoObjectParams, Gltf, GltfProps} from '@/entity';
import {Globe, GlobeContextProvider} from "@/Globe";
import {Vector} from "@/layer";
import {PlanetCamera} from "@/camera/PlanetCamera/PlanetCamera";

const meta = {
    component: Gltf,
    title: 'Components/Entity/Gltf',
    argTypes: {
        wheelSpeed: {
            control: {type: 'range', min: 0, max: 200, step: 1},
            description: 'Wheel rotation speed (°/s)',
            defaultValue: 20
        },
        cam0BaseYaw: {control: {type: 'range', min: -180, max: 180, step: 1}, defaultValue: 145},
        cam0JointYaw: {control: {type: 'range', min: -180, max: 180, step: 1}, defaultValue: 0},
        cam0HeadPitch: {control: {type: 'range', min: -90, max: 90, step: 1}, defaultValue: 0},
        scanerBaseYaw: {control: {type: 'range', min: -180, max: 180, step: 1}, defaultValue: 90},
        scanerLink1Pitch: {control: {type: 'range', min: -180, max: 180, step: 1}, defaultValue: 90},
        scanerJointPitch: {control: {type: 'range', min: -180, max: 180, step: 1}, defaultValue: 90},
    }
} satisfies Meta<typeof Gltf>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
    args: {
        src: '/story-assets/maxwell_the_cat.glb',
    },
    render: ({src}: GltfProps) =>
        <GlobeContextProvider>
            <Globe>
                <PlanetCamera lon={0} lat={0} alt={10} lookLon={0.001} lookLat={0} lookAlt={0} viewAngle={47}/>
                <Vector name="rover" scaleByDistance={[100, 4000000, 1]}>
                    <Entity name="maxwell" >
                        <Gltf src={src}/>
                    </Entity>
                </Vector>
            </Globe>
        </GlobeContextProvider>
};


export const Rover: Story = {
    args: {
        wheelSpeed: 20,
        cam0BaseYaw: 145,
        cam0JointYaw: 0,
        cam0HeadPitch: 0,
        scanerBaseYaw: 90,
        scanerLink1Pitch: 90,
        scanerJointPitch: 90,
    },
    render: (args) => {
        const {
            wheelSpeed,
            cam0BaseYaw,
            cam0JointYaw,
            cam0HeadPitch,
            scanerBaseYaw,
            scanerLink1Pitch,
            scanerJointPitch
        } = args as any;

        const [roll, setRoll] = useState(0);

        useEffect(() => {
            let animId: number;
            let frame = 0;

            const animate = (time: number) => {
                frame++;

                if (frame % 3 === 0) {
                    setRoll(prev => (prev + wheelSpeed / 60) % 360);
                }

                animId = requestAnimationFrame(animate);
            };

            animId = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(animId);
        }, [wheelSpeed]);

        return (
            <GlobeContextProvider>
                <Globe>
                    <PlanetCamera lon={0} lat={0} alt={10} lookLon={0.001} lookLat={0} lookAlt={0} viewAngle={47}/>
                    <Vector name="rover" scaleByDistance={[100, 4000000, 1]}>
                        <Entity name="rover_base" cartesian={[6, 8, 9]} yaw={110 * Math.PI / 180} relativePosition>
                            <Gltf src="/story-assets/rover_base.glb"/>

                            {/* Camera arm */}
                            <Entity name="cam0_base"
                                    cartesian={[0.751, 0.349, 0.521]}
                                    yaw={cam0BaseYaw}
                                    relativePosition>
                                <Gltf src="/story-assets/cam0_base.glb"/>

                                <Entity name="cam0_joint"
                                        cartesian={[0, 0.515, 0]}
                                        yaw={cam0JointYaw}
                                        relativePosition>
                                    <Gltf src="/story-assets/cam0_joint.glb"/>

                                    <Entity name="cam0_head"
                                            cartesian={[-0.035, 0.16, 0]}
                                            pitch={cam0HeadPitch}
                                            relativePosition>
                                        <Gltf src="/story-assets/cam0_head.glb"/>
                                    </Entity>
                                </Entity>
                            </Entity>

                            {/* Scaner */}
                            <Entity name="scaner_base"
                                    cartesian={[1.213, 0.022, -0.485]}
                                    yaw={scanerBaseYaw}
                                    relativePosition>
                                <Gltf src="/story-assets/scaner_base.glb"/>

                                <Entity name="scaner_link0" cartesian={[0.17, -0.09, -0.18]} relativePosition>
                                    <Gltf src="/story-assets/scaner_link0.glb"/>

                                    <Entity name="scaner_link1"
                                            cartesian={[0, 0.0, -0.838]}
                                            pitch={scanerLink1Pitch}
                                            relativePosition>
                                        <Gltf src="/story-assets/scaner_link1.glb"/>

                                        <Entity name="scaner_joint"
                                                cartesian={[-0.035, -0.005, -0.755]}
                                                pitch={scanerJointPitch}
                                                relativePosition>
                                            <Gltf src="/story-assets/scaner_joint.glb"/>

                                            <Entity name="scaner_head"
                                                    cartesian={[0.042, -0.15, -0.175]}
                                                    pitch={180 * Math.PI / 180}
                                                    relativePosition>
                                                <Gltf src="/story-assets/scaner_head.glb"/>
                                            </Entity>
                                        </Entity>
                                    </Entity>
                                </Entity>
                            </Entity>

                            {/* Left suspension */}
                            <Entity name="susp_left_front"
                                    cartesian={[0.26, -0.0, -0.78]}
                                    pitch={13 * Math.PI / 180}
                                    relativePosition>
                                <Gltf src="/story-assets/susp_left_front.glb"/>

                                <Entity name="amort_left_front"
                                        cartesian={[0.876, -0.3, -0.26]}
                                        pitch={-103 * Math.PI / 180}
                                        relativePosition>
                                    <Gltf src="/story-assets/amort_left_front.glb"/>

                                    <Entity
                                        name="wheel_front_left"
                                        cartesian={[0, -0.05, -0.395]}
                                        pitch={90 * Math.PI / 180}
                                        roll={-roll}
                                        relativePosition
                                    >
                                        <Gltf src="/story-assets/wheel_left.glb"/>
                                    </Entity>
                                </Entity>

                                <Entity name="susp_left_back"
                                        cartesian={[-0.757, -0.222, -0.008]}
                                        pitch={-13 * Math.PI / 180}
                                        relativePosition>
                                    <Gltf src="/story-assets/susp_left_back.glb"/>

                                    <Entity name="amort_left_back"
                                            cartesian={[-0.625, -0.01, -0.263]}
                                            relativePosition>
                                        <Gltf src="/story-assets/amort_left_back.glb"/>

                                        <Entity
                                            name="wheel_back_left"
                                            cartesian={[0, -0.392, 0.065]}
                                            roll={-roll}
                                            relativePosition
                                        >
                                            <Gltf src="/story-assets/wheel_left.glb"/>
                                        </Entity>
                                    </Entity>

                                    <Entity
                                        name="wheel_middle_left"
                                        cartesian={[0.45, -0.4, -0.3]}
                                        roll={-roll}
                                        relativePosition
                                    >
                                        <Gltf src="/story-assets/wheel_left.glb"/>
                                    </Entity>
                                </Entity>
                            </Entity>

                            {/* Right suspension */}
                            <Entity name="susp_right_front"
                                    cartesian={[0.253, 0.01, 0.711]}
                                    pitch={-13 * Math.PI / 180}
                                    relativePosition>
                                <Gltf src="/story-assets/susp_right_front.glb"/>

                                <Entity name="amort_right_front"
                                        cartesian={[0.876, -0.3, 0.26]}
                                        pitch={-77 * Math.PI / 180}
                                        relativePosition>
                                    <Gltf src="/story-assets/amort_right_front.glb"/>

                                    <Entity
                                        name="wheel_front_right"
                                        cartesian={[0.003, 0.065, -0.391]}
                                        pitch={-90 * Math.PI / 180}
                                        yaw={180 * Math.PI / 180}
                                        roll={roll}
                                        relativePosition
                                    >
                                        <Gltf src="/story-assets/wheel_left.glb"/>
                                    </Entity>
                                </Entity>

                                <Entity name="susp_right_back"
                                        cartesian={[-0.756, -0.243, 0.008]}
                                        pitch={13 * Math.PI / 180}
                                        relativePosition>
                                    <Gltf src="/story-assets/susp_right_back.glb"/>

                                    <Entity name="amort_right_back"
                                            cartesian={[-0.622, -0.0, 0.263]}
                                            relativePosition>
                                        <Gltf src="/story-assets/amort_right_back.glb"/>

                                        <Entity
                                            name="wheel_back_right"
                                            cartesian={[0, -0.392, -0.065]}
                                            yaw={180 * Math.PI / 180}
                                            roll={roll}
                                            relativePosition
                                        >
                                            <Gltf src="/story-assets/wheel_left.glb"/>
                                        </Entity>
                                    </Entity>

                                    <Entity
                                        name="wheel_middle_right"
                                        cartesian={[0.45, -0.4, 0.319]}
                                        yaw={180 * Math.PI / 180}
                                        roll={roll}
                                        relativePosition
                                    >
                                        <Gltf src="/story-assets/wheel_left.glb"/>
                                    </Entity>
                                </Entity>
                            </Entity>
                        </Entity>
                    </Vector>
                </Globe>
            </GlobeContextProvider>
        );
    },
};