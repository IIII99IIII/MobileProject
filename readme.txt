BLOC DE NOTAS – GUÍA PARA EXPONER LA APP MÓVIL

components/formulario/LoginForm.jsx
Propósito: pantalla de inicio de sesión con Firebase Auth.
Imports clave: react-hook-form (manejo de formularios y validaciones), signInWithEmailAndPassword (login), LinearGradient (fondo), componentes RN (KeyboardAvoidingView, ScrollView) para UX con teclado.
Estado/Form: useForm({ defaultValues: { email, password } }).
Expone: control (vincula inputs), handleSubmit (valida → ejecuta onSubmit), errors (muestra mensajes).
Validaciones:

email: requerido + regex básico de email.

password: requerida + minLength 6.
Controller + TextInput: conecta cada input al form (controla value, onChange, onBlur).
onSubmit: async → llama signInWithEmailAndPassword(auth, email, password).
Éxito: log en consola con el correo.
Errores comunes:

auth/wrong-password o auth/user-not-found → alerta “credenciales incorrectas”.

Otros → alerta genérica.
UI/UX: degradado de fondo, tarjeta centrada, KeyboardAvoidingView para evitar que el teclado tape inputs, ScrollView para pantallas chicas, estilos con colores propios.
Navegación secundaria: link “Regístrate” → navigation.navigate('SignUp').
Observación útil para defensa: actualmente no navega a “Home/Tabs” tras login exitoso (solo loguea). Suele añadirse navigation.replace('MainTabs') o similar tras el await para llevar al usuario a la app.

components/formulario/SignUpForm.jsx
Propósito: registro de usuario en Firebase Auth.
Imports clave: createUserWithEmailAndPassword, react-hook-form, LinearGradient.
Form/validación:

email: requerido + regex.

password: requerida + min 6.

confirmPassword: requerida + validate que compara con getValues('password').
onSubmit: intenta crear cuenta en Auth.
Éxito: consola + Alert de bienvenida.
Errores mapeados: email-already-in-use, weak-password, genérico.
UX: fondo con degradado, logo en contenedor circular, botón principal con degradado, botón “Volver al inicio” (navigation.goBack()).

navigation/MainPagerTabs.js
Propósito: tabs principales (estilo “bottom bar” animada) usando Material Top Tabs como contenedor pero con tabBar custom abajo.
Estructura:
TopTab = createMaterialTopTabNavigator() con tabBar={(props) => <BottomBar .../>} para renderizar barra inferior personalizada.
Screens: InicioTab (HomeStack), TurnosTab (TurnoStack), PacientesTab (PacienteStack), PerfilTab (ProfileStack).
BottomBar personalizada:

Anima opacity al montar (Animated.timing).

Adapta colores a modo claro/oscuro (useColorScheme).

Respeta safe area e incrementa altura con EXTRA_RAISE.

Recorre state.routes y pinta cada ítem con icono Ionicons y etiqueta de ICONS.

Muestra un dot bajo el tab activo.

onPress navega con navigation.navigate(route.name).

navigation/Navigation.js
Propósito: define stacks de Auth y el entry point a Tabs.
AuthStack: Login y SignUp (títulos configurados).
MainAppTabs: retorna MainPagerTabs (las tabs de la app logueada).
Patrón habitual: tras login, se cambia del AuthStack a MainAppTabs (p.ej., con un navigator raíz que decide según auth.currentUser).

navigation/Stacks.js
Propósito: stacks separados por dominio.
HomeStack: HomeTurnoScreen y DetailTurnoScreen (ver detalles desde Home).
TurnoStack: listado CRUD de turnos (TurnoList, AddTurno, EditTurno, DetailTurno).
ProfileStack: ProfileScreen.
PacienteStack: PacienteListScreen, AddPacienteScreen, EditPacienteScreen, DetailPacienteScreen.
Ventaja para defender: separa navegación por contexto, facilita deep-linking y back stacks limpios.

screens/addTurnoScreen/AddTurnoScreen.jsx
Propósito: crear un turno en Firestore.
Form: useForm con nombrePaciente, fecha, hora, motivo.
Validaciones:

fecha: regex YYYY-MM-DD.

hora: regex HH:MM 24h.
onSubmit: addDoc(collection(db, 'turnos'), {..., creadoEn: ISO}).
Éxito: alerta + navigation.navigate('TurnoList').
Error: log y alerta.
UX: useSafeAreaInsets + TAB_HEIGHT para que el FAB/barra no tape contenido.

screens/detailTurnoScreen/DetailTurnoScreen.jsx
Propósito: ver detalle de un turno.
Recibe turno por route.params. Si falta, muestra texto de error.
Muestra nombre/fecha/hora/motivo dentro de tarjeta estilizada.
Botón Editar → navigation.navigate('EditTurno', { turno }).

screens/editTurnoScreen/EditTurnoScreen.jsx
Propósito: editar un turno en Firestore (o crear si no existe).
Default values: toma de route.params.turno.
Validaciones: fecha/hora con regex.
Normalización: compone fechaHoraISO = new Date(${fecha}T${hora}:00).toISOString() para ahorro de consultas futuras por rango fecha-hora.
Flujo:

Si no hay turno o id: crea uno nuevo con addDoc.

Si hay id: getDoc(doc) →

existe → updateDoc.

no existe → setDoc para recrearlo con mismo id.
Mensajes: Alert en éxito/creación alternativa o error.
Navegación: vuelve a TurnoList tras guardar.

screens/homeTurnoScreen/HomeTurnoScreen.jsx
Propósito: dashboard con los 5 próximos turnos.
Suscripción en tiempo real: onSnapshot(query(collection('turnos'), orderBy('fecha'), orderBy('hora'), limit(5))).
Mapea QuerySnapshot a array { id, ...data }.
Limpia con unsubscribe en useEffect cleanup.
UI: lista “Próximos turnos” con íconos y accesos a detalle (DetailTurno).
Ventaja técnica: orden por fecha y hora combinados → lista correctamente cronológica.

screens/pacienteScreen/AddPacienteScreen.jsx
Propósito: crear pacientes localmente (no Firestore) con AsyncStorage desde la lista, usando callback addPaciente pasado por route.params.
Estados locales: nombre, telefono, email, edad, direccion.
UX con teclado: KeyboardAvoidingView + TouchableWithoutFeedback para cerrar teclado.
Scroll automático al enfocar campo usando UIManager.measureLayout y scrollRef.
handleAdd: valida nombre, arma objeto con id: Date.now() y llama a addPaciente(nuevoPaciente) → navigation.goBack().

screens/pacienteScreen/DetailPacienteScreen.jsx
Propósito: mostrar datos del paciente (pasados por route.params.paciente) en tarjeta con estilos. Incluye botón Volver (goBack).

screens/pacienteScreen/EditPacienteScreen.jsx
Propósito: editar paciente local (vía callback updatePaciente que viene del listado).
Estados controlados inicializados con route.params.paciente.
UX teclado/scroll: mismo patrón de AddPacienteScreen.
handleUpdate: valida nombre, arma pacienteActualizado y llama updatePaciente(...) → goBack().

screens/pacienteScreen/PacienteListScreen.jsx
Propósito: listado local de pacientes con AsyncStorage, menú hamburguesa por item y Toast de feedback.
Persistencia:

cargarPacientes: lee @pacientes (JSON) y setea estado.

guardarPacientes: guarda JSON y actualiza estado.
Callbacks pasados a otras pantallas:

addPaciente: agrega y guarda, muestra Toast “agregado”.

updatePaciente: mapea por id y guarda.

deletePaciente: Alert de confirmación → filtra y guarda, Toast “eliminado”.
UI: FlatList con tarjeta por paciente + menú (react-native-popup-menu) con opciones Detalle / Editar / Eliminar.
FAB (+): navega a AddPaciente pasando addPaciente.
Nota docente: este módulo usa storage local (no Firestore) a propósito; es útil para separar concern (turnos en nube, pacientes en local), o como demo offline.

screens/profileScreen/ProfileScreen.jsx
Propósito: perfil del usuario logueado + logout.
Datos del usuario:

auth.currentUser (email, displayName, metadata.creationTime, lastSignInTime).

Datos extra opcionales en Firestore: lee usuarios/{uid} con getDoc (nombre, teléfono, rol, dirección) si existen.
Cerrar sesión: Alert de confirmación → signOut(auth).
UI: tarjeta con ítems de perfil (ProfileItem con icono + label + valor).

screens/turnoListScreen/TurnoListScreen.jsx
Propósito: listado administrable de turnos desde Firestore.
Suscripción: onSnapshot(query(collection('turnos'), orderBy('fecha'), orderBy('hora'))).
Actualiza estado turnos en tiempo real.
Acciones por ítem:

Ver → DetailTurno.

Editar → EditTurno.

Eliminar → Alert de confirmación → deleteDoc(doc(db, 'turnos', id)).
CTA superior: botón “➕ Agregar Nuevo Turno” → AddTurno.
UX: respeta safe area y altura de tabs, listas vacías con mensaje.

theme/colors.js
Propósito: paleta unificada de colores.
primary / primaryDark: azules para énfasis y títulos.
bgSoft, cardBg, borderSoft: fondos y bordes suaves.
textMain, textMuted: tipografía principal y secundaria.
danger, success: acciones destructivas/confirmaciones.
shadow: base para sombras.

PREGUNTAS TÍPICAS DE DEFENSA
¿Cómo validás los formularios?
Con react-hook-form. Cada Controller define rules (required, pattern, minLength) y handleSubmit(onSubmit) solo ejecuta si todo es válido. Los errores están en formState.errors.

¿Cómo se autentica el usuario y dónde se guarda su sesión?
Con Firebase Auth (signInWithEmailAndPassword / createUserWithEmailAndPassword). Firebase mantiene el estado de sesión internamente (persistencia nativa). Se puede derivar a tabs tras login.

¿Cómo se sincronizan los turnos?
Con Firestore y onSnapshot + query(orderBy('fecha'), orderBy('hora')). Esto trae cambios en tiempo real y los ordena cronológicamente.

¿Por qué pacientes están en AsyncStorage y no en Firestore?
Para demostrar manejo de estado/persistencia local sin red y mantener un ejemplo simple de CRUD local. Es intercambiable; podríamos migrarlo a Firestore.

¿Qué pasa si falla la red al crear/editar turnos?
Se captura catch, se loguea el error y se muestra Alert. Para robustez, se podría añadir reintentos, validación contra fechaHora pasada, o colas offline.

Accesibilidad/UX con teclado en móviles
Uso de KeyboardAvoidingView, ScrollView y scroll al enfocar (UIManager.measureLayout) para que los inputs no queden ocultos.

Navegación y separación por dominios
Stacks por contexto (Home/Turnos/Pacientes/Perfil) dentro de tabs. Simplifica rutas y back stacks.

MEJORAS RÁPIDAS
Post-login redirect: en LoginForm, después de login exitoso hacer navigation.reset({...}) o replace hacia MainAppTabs.
Schema de Turnos: además de fecha/hora, ya guardás fechaHora ISO en edición; conviene también guardarlo en “crear turno” para consultas por rango.
Validación de fechas/hora reales: evitar fechas pasadas o horas inválidas con un check extra antes de guardar.
Unificar persistencia de Pacientes: migrar a Firestore si necesitás multi-dispositivo.
Manejo de loading states: botones deshabilitados durante await + ActivityIndicator.
Protección de rutas: impedir acceso a tabs si !auth.currentUser.
Mensajes de error localizados: mapear más códigos de Auth (too-many-requests, invalid-email, etc.).

MINI GLOSARIO
Controller: puente entre TextInput y react-hook-form.
handleSubmit: verifica reglas; si pasa, llama al callback.
onSnapshot: suscripción en vivo a una colección/consulta Firestore.
AsyncStorage: almacenamiento clave/valor local (JSON stringificado).