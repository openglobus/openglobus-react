import type { Meta, StoryObj } from '@storybook/react';

import { Globe } from './Globe';

const meta = {
  component: Globe,
  title: 'Components/Scenes/Globe',
  argTypes: {
    atmosphereEnabled: {
      description: 'Enable or disable atmosphere rendering',
      control: {
        type: 'boolean'
      },
      table: {
        defaultValue: { summary: 'true' }
      }
    },
    sunActive: {
      description: 'Enable or disable sun lighting',
      control: {
        type: 'boolean'
      },
      table: {
        defaultValue: { summary: 'true' }
      }
    },
    viewExtent: {
      description: 'Set initial view extent as [west, south, east, north] in degrees',
      control: {
        type: 'object'
      },
      table: {
        type: { summary: 'NumberArray4 | Extent' },
        defaultValue: { summary: 'undefined' }
      }
    }
  }
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

export const ViewExtentEurope: Story = {
  args: {
    atmosphereEnabled: true,
    viewExtent: [-10, 35, 40, 70] // Europe
  }
};