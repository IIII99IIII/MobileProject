// src/navigation/MainPagerTabs.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeStack, TurnoStack, ProfileStack, PacienteStack } from './Stacks';

const TAB_HEIGHT = 64;
const SIDE_MARGIN = 12;
const EXTRA_RAISE = 28;

const TopTab = createMaterialTopTabNavigator();

// Íconos y etiquetas
const ICONS = {
  InicioTab: { focused: 'home', unfocused: 'home-outline', label: 'Inicio' },
  TurnosTab: { focused: 'calendar', unfocused: 'calendar-outline', label: 'Turnos' },
  PacientesTab: { focused: 'people', unfocused: 'people-outline', label: 'Pacientes' },
  PerfilTab: { focused: 'person', unfocused: 'person-outline', label: 'Perfil' },
};

// Barra inferior personalizada
function BottomBar({ state, navigation, insets }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bottomOffset = EXTRA_RAISE + Math.max(insets.bottom, 0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, []);

  const themeColors = {
    active: isDark ? '#4dabf7' : '#ff6b6b',
    inactive: isDark ? '#9ca3af' : '#8e8e93',
    bg: isDark ? 'rgba(22,22,24,0.92)' : 'rgba(255,255,255,0.9)',
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(230,230,230,0.9)',
    shadow: '#000',
  };

  return (
    <Animated.View
      style={[
        styles.tabBar,
        {
          opacity: fadeAnim,
          bottom: bottomOffset,
          paddingBottom: Math.max(6, insets.bottom * 0.6),
          height: TAB_HEIGHT,
          backgroundColor: themeColors.bg,
          borderColor: themeColors.border,
          shadowColor: themeColors.shadow,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = ICONS[route.name];
        const iconName = focused ? meta.focused : meta.unfocused;

        return (
          <TouchableOpacity
            key={route.key}
            style={[
              styles.tabItem,
              focused && {
                backgroundColor: isDark
                  ? 'rgba(77, 171, 247, 0.15)'
                  : 'rgba(255, 107, 107, 0.12)',
              },
            ]}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={iconName}
              size={26}
              color={focused ? themeColors.active : themeColors.inactive}
              style={{ marginBottom: 2 }}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: focused ? themeColors.active : themeColors.inactive },
              ]}
            >
              {meta.label}
            </Text>
            {focused && (
              <View style={[styles.dot, { backgroundColor: themeColors.active }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

// Navegador principal
export default function MainPagerTabs() {
  const insets = useSafeAreaInsets();

  return (
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
        <TopTab.Screen name="PacientesTab" component={PacienteStack} />
        <TopTab.Screen name="PerfilTab" component={ProfileStack} />
      </TopTab.Navigator>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  tabBar: {
    position: 'absolute',
    left: SIDE_MARGIN,
    right: SIDE_MARGIN,
    borderRadius: 22,
    borderWidth: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
    elevation: 18,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    zIndex: 1000,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 18,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  dot: {
    marginTop: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export { TAB_HEIGHT, EXTRA_RAISE };
