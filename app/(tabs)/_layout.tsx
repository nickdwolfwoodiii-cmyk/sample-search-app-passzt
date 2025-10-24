
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import React from 'react';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      title: 'Samples',
      icon: 'music.note',
      route: '/(tabs)/(home)',
    },
    {
      name: 'profile',
      title: 'Profile',
      icon: 'person.circle',
      route: '/(tabs)/profile',
    },
  ];

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Screen
          name="(home)"
          options={{
            title: 'Samples',
            tabBarIcon: ({ color }) => <Icon name="music.note" color={color} />,
            tabBarLabel: ({ color }) => <Label color={color}>Samples</Label>,
          }}
        />
        <NativeTabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Icon name="person.circle" color={color} />,
            tabBarLabel: ({ color }) => <Label color={color}>Profile</Label>,
          }}
        />
      </NativeTabs>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
