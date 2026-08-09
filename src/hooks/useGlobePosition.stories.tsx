import type {Meta, StoryObj} from '@storybook/react-vite';
import React from 'react';
import {Globe, GlobeContextProvider} from '@/Globe';
import {useGlobePosition} from '@/hooks/useGlobePosition';
import type {LonLatInput} from '@/types/openglobus';

const meta = {
    title: 'Hooks/useGlobePosition',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// 🌍 Массив городов
const cities: {name: string; coords: LonLatInput}[] = [
    { name: "📍 Dubai", coords: [55.27, 25.20, 0] },
    { name: "🗼 Paris", coords: [2.3522, 48.8566, 0] },
    { name: "🗽 New York", coords: [-74.006, 40.7128, 0] },
    { name: "🎌 Tokyo", coords: [139.6917, 35.6895, 0] },
    { name: "🕌 Cairo", coords: [31.2357, 30.0444, 0] },
    { name: "🦘 Sydney", coords: [151.2093, -33.8688, 0] },
    { name: "🧊 Reykjavik", coords: [-21.8174, 64.1265, 0] },
    { name: "🕍 Moscow", coords: [37.6173, 55.7558, 0] },
    { name: "🌋 Honolulu", coords: [-157.8583, 21.3069, 0] },
];

const Marker: React.FC<{name: string; lonLat: LonLatInput}> = ({name, lonLat}) => {
    const pos = useGlobePosition(lonLat, undefined, [0, -12]);
    if (!pos?.visible) return null;

    return (
        <div
            style={{
                position: 'absolute',
                transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -100%)`,
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '13px',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
            }}
        >
            {name}
        </div>
    );
};

export const MultiplePins: Story = {
    render: () => (
        <GlobeContextProvider>
            <div style={{position: 'relative', width: '100%', height: '600px'}}>
                <Globe atmosphereEnabled={true} sunActive={true} />
                {cities.map((city) => (
                    <Marker
                        key={city.name}
                        name={city.name}
                        lonLat={city.coords}
                    />
                ))}
            </div>
        </GlobeContextProvider>
    ),
};
