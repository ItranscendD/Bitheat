import React from 'react';
import { View } from 'react-native';
import { BitheatCard } from '../BitheatCard';
import { Ionicons } from '@expo/vector-icons';

export default {
  title: 'BitheatCard',
  component: BitheatCard,
  decorators: [
    (Story: any) => (
      <View style={{ padding: 16, width: '100%' }}>
        <Story />
      </View>
    ),
  ],
};

export const Data = {
  args: {
    variant: 'data',
    title: 'John Doe',
    subtitle: 'MALE • 5 YEARS',
    body: 'Last event: Checkup (Yola Camp)',
  },
};

export const Action = {
  args: {
    variant: 'action',
    title: 'New Record',
    subtitle: 'Add a child to the ledger',
    icon: <Ionicons name="add-circle" size={24} color="#0CCE8B" />,
  },
};

export const Status = {
  args: {
    variant: 'status',
    title: 'Blockchain Sync',
    body: 'Connected to Celo Alfajores',
    statusColor: '#0CCE8B',
  },
};
