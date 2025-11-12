// Importa React y hooks de animación/tema.
import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  useColorScheme,
} from 'react-native';
// Iconos de Expo (Ionicons).
import { Ionicons } from '@expo/vector-icons';
// Insets seguros (para respetar notch, barras, etc).
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Top Tabs de React Navigation (las usamos como base para una barra inferior custom).
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Stacks que renderiza cada tab.
import { HomeStack, TurnoStack, ProfileStack, PacienteStack } from './Stacks';

// Altura constante de la barra
const TAB_HEIGHT = 64;
// Márgenes laterales
const SIDE_MARGIN = 12;
// Cuánto se eleva desde el borde inferior
const EXTRA_RAISE = 28;

// Crea el navegador de pestañas superiores (que usaremos como barra inferior custom).
const TopTab = createMaterialTopTabNavigator();

// Mapa de íconos/etiquetas por cada tab.
const ICONS = {
  InicioTab: { focused: 'home', unfocused: 'home-outline', label: 'Inicio' },
  TurnosTab: { focused: 'calendar', unfocused: 'calendar-outline', label: 'Turnos' },
  PacientesTab: { focused: 'people', unfocused: 'people-outline', label: 'Pacientes' },
  PerfilTab: { focused: 'person', unfocused: 'person-outline', label: 'Perfil' },
};

// Barra inferior personalizada que reemplaza a la tabBar por defecto.
function BottomBar({ state, navigation, insets }) {
  // Valor animado para fade-in.
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Detecta si el sistema está en modo oscuro o claro.
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // Offset inferior para no tapar por el área segura + elevar un poco.
  const bottomOffset = EXTRA_RAISE + Math.max(insets.bottom, 0);

  // Efecto: al montar, anima la opacidad de 0 -> 1 en 450ms.
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, []);

  // Paleta dinámica según tema del sistema.
  const themeColors = {
    active: isDark ? '#4dabf7' : '#ff6b6b',               // color activo (icono/texto)
    inactive: isDark ? '#9ca3af' : '#8e8e93',             // color inactivo
    bg: isDark ? 'rgba(22,22,24,0.92)' : 'rgba(255,255,255,0.9)', // fondo blur-like
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(230,230,230,0.9)', // borde sutil
    shadow: '#000',                                       // sombra
  };

  return (
    // Contenedor animado de la barra
    <Animated.View
      style={[
        styles.tabBar,
        {
          opacity: fadeAnim,                   // aplica fade-in
          bottom: bottomOffset,                // posición desde abajo
          paddingBottom: Math.max(6, insets.bottom * 0.6), // respiración con área segura
          height: TAB_HEIGHT,                  // altura fija
          backgroundColor: themeColors.bg,     // color de fondo según tema
          borderColor: themeColors.border,     // borde suave
          shadowColor: themeColors.shadow,     // color sombra
        },
      ]}
    >
      {/* Recorre las rutas del estado de navegación para dibujar cada botón */}
      {state.routes.map((route, index) => {
        const focused = state.index === index;          // ¿esta tab está enfocada?
        const meta = ICONS[route.name];                 // metadatos (icono/label)
        const iconName = focused ? meta.focused : meta.unfocused; // elige icono

        return (
          // Botón de la pestaña
          <TouchableOpacity
            key={route.key}
            style={[
              styles.tabItem,
              focused && {
                // fondo apenas tintado al estar activo
                backgroundColor: isDark
                  ? 'rgba(77, 171, 247, 0.15)'
                  : 'rgba(255, 107, 107, 0.12)',
              },
            ]}
            onPress={() => navigation.navigate(route.name)} // navega a la ruta
            activeOpacity={0.85}                            // opacidad al presionar
          >
            {/* Icono dinámico */}
            <Ionicons
              name={iconName}
              size={26}
              color={focused ? themeColors.active : themeColors.inactive}
              style={{ marginBottom: 2 }}
            />
            {/* Etiqueta */}
            <Text
              style={[
                styles.tabLabel,
                { color: focused ? themeColors.active : themeColors.inactive },
              ]}
            >
              {meta.label}
            </Text>
            {/* Punto decorativo cuando está enfocada */}
            {focused && (
              <View style={[styles.dot, { backgroundColor: themeColors.active }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

// Contenedor principal del Tab Navigator
export default function MainPagerTabs() {
  // Insets para respetar áreas seguras al pasar al tabBar custom.
  const insets = useSafeAreaInsets();

  return (
    // View envolvente (permite que la tabBar "flote" sobre el contenido)
    <View style={styles.container} pointerEvents="box-none">
      <TopTab.Navigator
        initialRouteName="InicioTab"         // tab inicial
        screenOptions={{
          swipeEnabled: true,                 // permitir swipe entre tabs
          tabBarIndicatorStyle: { height: 0 }, // ocultar indicador superior
        }}
        // Reemplaza la tabBar por nuestra BottomBar personalizada
        tabBar={(props) => <BottomBar {...props} insets={insets} />}
      >
        {/* Cada tab renderiza un Stack distinto */}
        <TopTab.Screen name="InicioTab" component={HomeStack} />
        <TopTab.Screen name="TurnosTab" component={TurnoStack} />
        <TopTab.Screen name="PacientesTab" component={PacienteStack} />
        <TopTab.Screen name="PerfilTab" component={ProfileStack} />
      </TopTab.Navigator>
    </View>
  );
}

// Estilos base de la barra y contenedor
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'visible',     // permite que la barra sobresalga
  },
  tabBar: {
    position: 'absolute',    // flota
    left: SIDE_MARGIN,
    right: SIDE_MARGIN,
    borderRadius: 22,
    borderWidth: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
    elevation: 18,           // sombra Android
    shadowOpacity: 0.15,     // sombra iOS
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    zIndex: 1000,            // por encima del contenido
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

// Exporta constantes para calcular paddings en pantallas (altura barra)
export { TAB_HEIGHT, EXTRA_RAISE };
