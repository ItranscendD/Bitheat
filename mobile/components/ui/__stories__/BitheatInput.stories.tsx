import React from 'react';
import { View } from 'react-native';
import { BitheatInput } from '../BitheatInput';

export default {
  title: 'BitheatInput',
  component: BitheatInput,
  decorators: [
    (Story: any) => (
      <View style={{ padding: 16, width: '100%' }}>
        <Story />
      </View>
    ),
  ],
};

export const Default = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
  },
};

export const FieldMode = {
  args: {
    label: 'Phone Number',
    placeholder: '+234...',
    fieldMode: true,
  },
};

export const WithError = {
  args: {
    label: 'PIN Code',
    placeholder: '****',
    error: 'Incorrect PIN',
  },
};
