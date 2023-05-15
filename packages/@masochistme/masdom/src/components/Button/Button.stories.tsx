import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Size, Variant } from 'common';
import { Button } from './Button';
import { StoryRowWrapper, StoryWrapper } from '_storyHelper/helpers';

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

const onClick = () => {
  /** */
};

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    label: 'Button',
  },
};

export const Sizes: Story = {
  args: {
    label: 'Button',
    onClick,
  },
  render: args => (
    <StoryWrapper>
      {(['ash', 'dust', 'meat'] as const).map(theme => (
        <StoryRowWrapper label={`Theme: ${theme.toUpperCase()}`}>
          <Button {...args} size={Size.NANO} theme={theme} />
          <Button {...args} size={Size.MICRO} theme={theme} />
          <Button {...args} size={Size.TINY} theme={theme} />
          <Button {...args} size={Size.SMALL} theme={theme} />
          <Button {...args} size={Size.MEDIUM} theme={theme} />
          <Button {...args} size={Size.BIG} theme={theme} />
          <Button {...args} size={Size.LARGE} theme={theme} />
        </StoryRowWrapper>
      ))}
    </StoryWrapper>
  ),
};

export const Variants: Story = {
  args: {
    label: 'Button',
    onClick,
  },
  render: args => (
    <StoryWrapper>
      {(['ash', 'dust', 'meat'] as const).map(theme => (
        <StoryRowWrapper label={`Theme: ${theme.toUpperCase()}`}>
          <Button {...args} theme={theme} />
          <Button {...args} variant={Variant.PRIMARY} theme={theme} />
          <Button {...args} variant={Variant.SECONDARY} theme={theme} />
          <Button {...args} variant={Variant.DANGER} theme={theme} />
          <Button {...args} variant={Variant.GOLDEN} theme={theme} />
        </StoryRowWrapper>
      ))}
    </StoryWrapper>
  ),
};
