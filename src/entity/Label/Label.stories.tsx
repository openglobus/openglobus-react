import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Entity, Label, LabelParams} from '@/entity';
import {Globe, GlobeContextProvider} from "@/Globe";
import {Vector} from "@/layer";

const meta = {
    component: Label,
    title: 'Components/Entity/Label',
    argTypes: {
        face: {
            options: ['Sacramento-Regular', 'NotoSansArabic-Regular', 'Audiowide-Regular'],
            control: {type: 'select'},
        }
    }
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        color: "#053df3",
        outlineColor: "#33fa07",
        rotation: 0,
        face: 'Audiowide-Regular',
        align: 'center',
        opacity: 1,
        size: 32,
        outline: 0.2,
        text: "Hello, World!",
        offset: [0, 0, 0],
        visibility: true,
        isRTL: false,
    },
    render: (args: LabelParams) => {
        return <GlobeContextProvider>
            <Globe
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Label
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globe>
        </GlobeContextProvider>;
    }
};

export const Arabic: Story = {
    args: {
        ...Default.args,
        text: 'حبيبي',
        face: 'NotoSansArabic-Regular',
        isRTL: true,
    },
    render: (args: LabelParams) => {
        return <GlobeContextProvider>
            <Globe
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Label
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globe>
        </GlobeContextProvider>;
    }
};