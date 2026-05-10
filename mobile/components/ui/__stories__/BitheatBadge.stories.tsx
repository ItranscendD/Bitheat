import React from 'react';
import { View } from 'react-native';
import { BitheatBadge } from '../BitheatBadge';

export default {
  title: 'BitheatBadge',
  component: BitheatBadge,
  decorators: [
    (Story: any) => (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
};

export const Online = {
  args: {
    variant: 'online',
  },
};

export const Offline = {
  args: {
    variant: 'offline',
  },
};

export const Syncing = {
  args: {
    variant: 'syncing',
  },
};

export const Anchored = {
  args: {
    variant: 'anchored',
  },
};

export const Alert = {
  args: {
    variant: 'alert',
  },
};
