import React, {useEffect, useMemo, useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Entity as GlobusEntity, LonLat, math} from '@openglobus/og';

import {Entity, Gltf, GltfProps} from '@/entity';
import {Globe, GlobeContextProvider, useGlobeContext} from '@/Globe';
import {Vector} from '@/layer';
import {PlanetCamera} from '@/camera/PlanetCamera/PlanetCamera';

const asset = (name: string) => `/story-assets/${name}.glb`;
const defaultModelLongitude = 0.0001;
const grandCanyon = {lon: -112.107946, lat: 36.06165};
const grandCanyonCamera = {lon: -112.108026, lat: 36.0616};
const grandCanyonFallbackHeight = 2150;

type RoverEntityChild = React.ComponentProps<typeof Entity>['children'];

const GrandCanyonRoverPlacement: React.FC<{children: RoverEntityChild}> = ({children}) => {
    const {globe} = useGlobeContext();
    const [groundHeight, setGroundHeight] = useState({
        rover: grandCanyonFallbackHeight,
        camera: grandCanyonFallbackHeight
    });
    const cameraLonLat = useMemo(
        () => new LonLat(grandCanyonCamera.lon, grandCanyonCamera.lat, groundHeight.camera + 5.5),
        [groundHeight.camera]
    );
    const roverLookLonLat = useMemo(
        () => new LonLat(grandCanyon.lon, grandCanyon.lat, groundHeight.rover + 1.7),
        [groundHeight.rover]
    );

    useEffect(() => {
        if (!globe) return;

        let active = true;
        Promise.all([
            globe.planet.getHeightAboveELL(new LonLat(grandCanyon.lon, grandCanyon.lat)),
            globe.planet.getHeightAboveELL(new LonLat(grandCanyonCamera.lon, grandCanyonCamera.lat))
        ]).then(([roverHeight, cameraHeight]) => {
            if (!active) return;

            setGroundHeight({
                rover: Number.isFinite(roverHeight) && roverHeight > 500
                    ? roverHeight
                    : grandCanyonFallbackHeight,
                camera: Number.isFinite(cameraHeight) && cameraHeight > 500
                    ? cameraHeight
                    : grandCanyonFallbackHeight
            });
        });

        return () => {
            active = false;
        };
    }, [globe]);

    return <>
        <PlanetCamera
            lonLat={cameraLonLat}
            lookLonLat={roverLookLonLat}
            viewAngle={32}
        />
        <Vector name="rover" scaleByDistance={[100, 4000000, 1]}>
            <Entity name="rover_position"
                    lonLat={[grandCanyon.lon, grandCanyon.lat, groundHeight.rover + 1.0]}
                    updateRelativeCenter>
                {children}
            </Entity>
        </Vector>
    </>;
};

type GltfStoryArgs = GltfProps & {
    wheelSpeed?: number;
    cam0BaseYaw?: number;
    cam0JointYaw?: number;
    cam0HeadPitch?: number;
    scanerBaseYaw?: number;
    scanerLink1Pitch?: number;
    scanerJointPitch?: number;
};

const meta: Meta<GltfStoryArgs> = {
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
};

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
    args: {
        src: asset('maxwell_the_cat'),
    },
    render: ({src}: GltfProps) =>
        <GlobeContextProvider>
            <Globe>
                <PlanetCamera
                    lonLat={new LonLat(0, 0, 10)}
                    lookLonLat={new LonLat(defaultModelLongitude, 0, 0)}
                    viewAngle={47}
                />
                <Vector name="gltf-model" scaleByDistance={[100, 4000000, 1]}>
                    <Entity name="maxwell" lonLat={[defaultModelLongitude, 0]}>
                        <Gltf src={src}/>
                    </Entity>
                </Vector>
            </Globe>
        </GlobeContextProvider>
};


export const Rover: Story = {
    args: {
        src: asset('rover_base'),
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
            src,
            wheelSpeed,
            cam0BaseYaw,
            cam0JointYaw,
            cam0HeadPitch,
            scanerBaseYaw,
            scanerLink1Pitch,
            scanerJointPitch
        } = args;

        const wheelFrontLeftRef = React.useRef<GlobusEntity | null>(null);
        const wheelBackLeftRef = React.useRef<GlobusEntity | null>(null);
        const wheelMiddleLeftRef = React.useRef<GlobusEntity | null>(null);
        const wheelFrontRightRef = React.useRef<GlobusEntity | null>(null);
        const wheelBackRightRef = React.useRef<GlobusEntity | null>(null);
        const wheelMiddleRightRef = React.useRef<GlobusEntity | null>(null);
        const wheelSpeedRef = React.useRef(wheelSpeed ?? 0);
        const wheelRollRef = React.useRef(0);

        useEffect(() => {
            wheelSpeedRef.current = wheelSpeed ?? 0;
        }, [wheelSpeed]);

        useEffect(() => {
            let animId: number;
            let previousTime: number | undefined;

            const animate = (time: number) => {
                if (previousTime !== undefined) {
                    const elapsedSeconds = (time - previousTime) / 1000;
                    wheelRollRef.current = (
                        wheelRollRef.current + wheelSpeedRef.current * elapsedSeconds * math.RADIANS
                    ) % (2 * Math.PI);

                    wheelFrontLeftRef.current?.setRoll(-wheelRollRef.current);
                    wheelBackLeftRef.current?.setRoll(-wheelRollRef.current);
                    wheelMiddleLeftRef.current?.setRoll(-wheelRollRef.current);
                    wheelFrontRightRef.current?.setRoll(wheelRollRef.current);
                    wheelBackRightRef.current?.setRoll(wheelRollRef.current);
                    wheelMiddleRightRef.current?.setRoll(wheelRollRef.current);
                }
                previousTime = time;

                animId = requestAnimationFrame(animate);
            };

            animId = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(animId);
        }, []);

        return (
            <GlobeContextProvider>
                <Globe>
                    <GrandCanyonRoverPlacement>
                        <Entity name="rover_base" cartesian={[0, 0, 0]} yaw={110} relativePosition>
                            <Gltf src={src}/>

                            {/* Camera arm */}
                            <Entity name="cam0_base"
                                    cartesian={[0.751, 0.349, 0.521]}
                                    yaw={cam0BaseYaw}
                                    relativePosition>
                                <Gltf src={asset('cam0_base')}/>

                                <Entity name="cam0_joint"
                                        cartesian={[0, 0.515, 0]}
                                        yaw={cam0JointYaw}
                                        relativePosition>
                                    <Gltf src={asset('cam0_joint')}/>

                                    <Entity name="cam0_head"
                                            cartesian={[-0.035, 0.16, 0]}
                                            pitch={cam0HeadPitch}
                                            relativePosition>
                                        <Gltf src={asset('cam0_head')}/>
                                    </Entity>
                                </Entity>
                            </Entity>

                            {/* Scaner */}
                            <Entity name="scaner_base"
                                    cartesian={[1.213, 0.022, -0.485]}
                                    yaw={scanerBaseYaw}
                                    relativePosition>
                                <Gltf src={asset('scaner_base')}/>

                                <Entity name="scaner_link0" cartesian={[0.17, -0.09, -0.18]} relativePosition>
                                    <Gltf src={asset('scaner_link0')}/>

                                    <Entity name="scaner_link1"
                                            cartesian={[0, 0.0, -0.838]}
                                            pitch={scanerLink1Pitch}
                                            relativePosition>
                                        <Gltf src={asset('scaner_link1')}/>

                                        <Entity name="scaner_joint"
                                                cartesian={[-0.035, -0.005, -0.755]}
                                                pitch={scanerJointPitch}
                                                relativePosition>
                                            <Gltf src={asset('scaner_joint')}/>

                                            <Entity name="scaner_head"
                                                    cartesian={[0.042, -0.15, -0.175]}
                                                    pitch={180}
                                                    relativePosition>
                                                <Gltf src={asset('scaner_head')}/>
                                            </Entity>
                                        </Entity>
                                    </Entity>
                                </Entity>
                            </Entity>

                            {/* Left suspension */}
                            <Entity name="susp_left_front"
                                    cartesian={[0.26, -0.0, -0.78]}
                                    pitch={13}
                                    relativePosition>
                                <Gltf src={asset('susp_left_front')}/>

                                <Entity name="amort_left_front"
                                        cartesian={[0.876, -0.3, -0.26]}
                                        pitch={-103}
                                        relativePosition>
                                    <Gltf src={asset('amort_left_front')}/>

                                    <Entity
                                        ref={wheelFrontLeftRef}
                                        name="wheel_front_left"
                                        cartesian={[0, -0.05, -0.395]}
                                        pitch={90}
                                        relativePosition
                                    >
                                        <Gltf src={asset('wheel_left')}/>
                                    </Entity>
                                </Entity>

                                <Entity name="susp_left_back"
                                        cartesian={[-0.757, -0.222, -0.008]}
                                        pitch={-13}
                                        relativePosition>
                                    <Gltf src={asset('susp_left_back')}/>

                                    <Entity name="amort_left_back"
                                            cartesian={[-0.625, -0.01, -0.263]}
                                            relativePosition>
                                        <Gltf src={asset('amort_left_back')}/>

                                        <Entity
                                            ref={wheelBackLeftRef}
                                            name="wheel_back_left"
                                            cartesian={[0, -0.392, 0.065]}
                                            relativePosition
                                        >
                                            <Gltf src={asset('wheel_left')}/>
                                        </Entity>
                                    </Entity>

                                    <Entity
                                        ref={wheelMiddleLeftRef}
                                        name="wheel_middle_left"
                                        cartesian={[0.45, -0.4, -0.3]}
                                        relativePosition
                                    >
                                        <Gltf src={asset('wheel_left')}/>
                                    </Entity>
                                </Entity>
                            </Entity>

                            {/* Right suspension */}
                            <Entity name="susp_right_front"
                                    cartesian={[0.253, 0.01, 0.711]}
                                    pitch={-13}
                                    relativePosition>
                                <Gltf src={asset('susp_right_front')}/>

                                <Entity name="amort_right_front"
                                        cartesian={[0.876, -0.3, 0.26]}
                                        pitch={-77}
                                        relativePosition>
                                    <Gltf src={asset('amort_right_front')}/>

                                    <Entity
                                        ref={wheelFrontRightRef}
                                        name="wheel_front_right"
                                        cartesian={[0.003, 0.065, -0.391]}
                                        pitch={-90}
                                        yaw={180}
                                        relativePosition
                                    >
                                        <Gltf src={asset('wheel_left')}/>
                                    </Entity>
                                </Entity>

                                <Entity name="susp_right_back"
                                        cartesian={[-0.756, -0.243, 0.008]}
                                        pitch={13}
                                        relativePosition>
                                    <Gltf src={asset('susp_right_back')}/>

                                    <Entity name="amort_right_back"
                                            cartesian={[-0.622, -0.0, 0.263]}
                                            relativePosition>
                                        <Gltf src={asset('amort_right_back')}/>

                                        <Entity
                                            ref={wheelBackRightRef}
                                            name="wheel_back_right"
                                            cartesian={[0, -0.392, -0.065]}
                                            yaw={180}
                                            relativePosition
                                        >
                                            <Gltf src={asset('wheel_left')}/>
                                        </Entity>
                                    </Entity>

                                    <Entity
                                        ref={wheelMiddleRightRef}
                                        name="wheel_middle_right"
                                        cartesian={[0.45, -0.4, 0.319]}
                                        yaw={180}
                                        relativePosition
                                    >
                                        <Gltf src={asset('wheel_left')}/>
                                    </Entity>
                                </Entity>
                            </Entity>
                        </Entity>
                    </GrandCanyonRoverPlacement>
                </Globe>
            </GlobeContextProvider>
        );
    },
};
