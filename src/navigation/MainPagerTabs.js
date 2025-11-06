// src/navigation/MainPagerTabs.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { HomeStack, TurnoStack, ProfileStack } from './Stacks';

const TAB_HEIGHT = 64;
const SIDE_MARGIN = 12;
const EXTRA_RAISE = 28;

const TopTab = createMaterialTopTabNavigator();

const ICONS = {
  InicioTab: { focused: 'home', unfocused: 'home-outline', label: 'Inicio' },
  TurnosTab: { focused: 'calendar', unfocused: 'calendar-outline', label: 'Turnos' },
  PerfilTab: { focused: 'person', unfocused: 'person-outline', label: 'Perfil' },
};

function BottomBar({ state, navigation, insets }) {
  const bottomOffset = EXTRA_RAISE + Math.max(insets.bottom, 0);

  return (
    <View
      style={[
        styles.tabBar,
        {
          bottom: bottomOffset,
          paddingBottom: Math.max(6, insets.bottom * 0.6),
          height: TAB_HEIGHT,
        },
      ]}
      // aseguramos que esté por encima y reciba toques
      pointerEvents="auto"
    >
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const meta = ICONS[route.name];
        const icon = focused ? meta.focused : meta.unfocused;
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.85}
          >
            <Ionicons name={icon} size={26} color={focused ? 'tomato' : 'gray'} />
            <Text style={[styles.tabLabel, { color: focused ? 'tomato' : 'gray' }]}>{meta.label}</Text>
            <View style={[styles.dot, { opacity: focused ? 1 : 0 }]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MainPagerTabs() {
  const insets = useSafeAreaInsets();

  return (
    // este contenedor no debe recortar (overflow) y deja pasar toques al tabBar
    <View style={styles.container} pointerEvents="box-none">
      <TopTab.Navigator
        initialRouteName="InicioTab"
        screenOptions={{
          swipeEnabled: true,
          tabBarIndicatorStyle: { height: 0 },
        }}
        tabBar={(props) => <BottomBar {...props} insets={insets} />}
      >
        <TopTab.Screen name="InicioTab" component={HomeStack} />
        <TopTab.Screen name="TurnosTab" component={TurnoStack} />
        <TopTab.Screen name="PerfilTab" component={ProfileStack} />
      </TopTab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // importante: no recortar el hijo absoluto
    overflow: 'visible',
  },
  tabBar: {
    position: 'absolute',
    left: SIDE_MARGIN,
    right: SIDE_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
    elevation: 20,     // Android
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    zIndex: 1000,      // iOS/Android: por encima del contenido
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabLabel: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  dot: { marginTop: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: 'tomato' },
});

export { TAB_HEIGHT, EXTRA_RAISE };
