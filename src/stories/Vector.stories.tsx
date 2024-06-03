import type { Meta, StoryObj } from '@storybook/react';

import {Vector, VectorProps} from '../layer/Vector';
import {Billboard, BillboardParams} from "../entity";
import {GlobusContextProvider} from "../GlobeContext";
import { action } from '@storybook/addon-actions';

import {Globus} from "../Globe";
import {Entity} from "../entity/Entity";
import {LonLat} from "@openglobus/og";
import React from "react";
import {fn} from "@storybook/test";

const meta = {
  component: Vector,
} satisfies Meta<typeof Vector>;

export default meta;

type Story = StoryObj<typeof meta>;



  export const Default: Story = {
    // parameters: {
    //   actions: { argTypesRegex: '^on*' },
    // },
  args: {
    name: 'test',
    onMouseEnter: action('on-click',{depth: 1,  maxDepth:0}),
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

