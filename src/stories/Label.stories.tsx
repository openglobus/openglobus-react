import type {Meta, StoryObj} from '@storybook/react';

import {Entity} from '../entity/Entity';
import {Globus} from "../Globe";
import {Vector} from "../layer/Vector";
import React from 'react';
import {Label, LabelParams} from "../entity";
import {GlobusContextProvider} from "../GlobeContext";

const meta = {
    component: Label,
    tags: ['autodocs'],
    argTypes: {
        face: {
            options: ['Sacramento-Regular', 'NotoSansArabic-Regular', 'Audiowide-Regular'],
            control: {type: 'select'}, // Automatically inferred when 'options' is defined
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
        return <GlobusContextProvider>
            <Globus atmosphereEnabled={false}
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Label
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globus>
        </GlobusContextProvider>;
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
        return <GlobusContextProvider>
            <Globus atmosphereEnabled={false}
                    fontsSrc={"https://openglobus.org/examples/examples/fonts/fonts"}>
                <Vector name={'test'}>
                    <Entity name="Custom Entity" lon={0} lat={0} alt={0}>
                        <Label
                            {...args}
                        />
                    </Entity>
                </Vector>
            </Globus>
        </GlobusContextProvider>;
    }
};