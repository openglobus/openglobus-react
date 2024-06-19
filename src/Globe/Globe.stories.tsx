import type { Meta, StoryObj } from '@storybook/react';

import { Globe } from './Globe';

const meta = {
  component: Globe,
  title: 'Components/Scenes/Globe',
} satisfies Meta<typeof Globe>;

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