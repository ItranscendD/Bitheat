import React from 'react';
import { View } from 'react-native';
import { BitheatButton } from '../BitheatButton';

export default {
  title: 'BitheatButton',
  component: BitheatButton,
  argTypes: {
    onPress: { action: 'pressed' },
  },
  decorators: [
    (Story: any) => (
      <View style={{ padding: 16, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export const Primary = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    label: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Large = {
  args: {
    label: 'Large Action',
    size: 'lg',
    variant: 'primary',
  },
};

export const Loading = {
  args: {
    label: 'Processing',
    loading: true,
  },
};

export const Disabled = {
  args: {
    label: 'Disabled Button',
    disabled: true,
  },
};
