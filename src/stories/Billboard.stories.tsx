import type {Meta, StoryObj} from '@storybook/react';

import {Entity} from '../Entity';
import {Globus} from "../Globe";
import {Vector} from "../Vector";
import React from 'react';
import {Billboard, BillboardParams} from "../entity";
import {LonLat} from "@openglobus/og";
import {GlobusContextProvider} from "../GlobeContext";

const meta = {
  component: Billboard,
} satisfies Meta<typeof Billboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: [96, 96],
    color: "#ff5959",
    src: 'https://openglobus.org/examples/examples/billboards/carrot.png'
  },
  render: (args: BillboardParams) => <GlobusContextProvider>
    <Globus atmosphereEnabled={false}>
      <Vector name={'test'}
              scaleByDistance={[6000000, 24000000, 10000000000]}>
        <Entity name="Custom Entity" lonlat={LonLat.createFromArray([0, 0, 0])}>
          <Billboard
              {...args}
          />
        </Entity>
      </Vector>
    </Globus>
  </GlobusContextProvider>
};

// export const Default = (args: BillboardParams) =>
