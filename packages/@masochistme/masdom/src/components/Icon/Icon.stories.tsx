import React from 'react';
import type { StoryObj } from '@storybook/react';

import { Icon } from './Icon';

export default {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    //
  },
  render: () => <Icon icon="AnglesDown" />,
};
