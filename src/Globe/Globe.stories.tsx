import type { Meta, StoryObj } from '@storybook/react';

import { Globus } from './Globe';

const meta = {
  component: Globus,
  title: 'Components/Scenes/Globe',
} satisfies Meta<typeof Globus>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    atmosphereEnabled: false
  }
};
export const AtmosphereEnabled: Story = {
  args: {
    atmosphereEnabled: true
  }
};