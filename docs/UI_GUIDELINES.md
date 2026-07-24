# UI Guidelines — Cleaning App

## Stack
- **Styling:** NativeWind v4 (Tailwind CSS) + `class-variance-authority` + `tailwind-merge`
- **Animation:** React Native Animated (built-in) + react-native-reanimated
- **Icons:** Unicode/emoji placeholders (SVG-ready with react-native-svg)

## Componentes del Design System

Todos los componentes viven en `src/components/ui/` y se importan desde `@/components/ui`.

### Button
`<Button title="texto" onPress={fn} variant="primary" size="md" fullWidth loading disabled leftIcon rightIcon />`

| Prop | Type | Default |
|------|------|---------|
| variant | `primary \| secondary \| outline \| ghost \| danger` | `primary` |
| size | `sm \| md \| lg` | `md` |
| fullWidth | `boolean` | `false` |
| loading | `boolean` | `false` |
| disabled | `boolean` | `false` |
| leftIcon / rightIcon | `ReactNode` | — |

### Input
`<Input label="Campo" value={v} onChangeText={fn} error="Error msg" helperText required secureTextEntry leftIcon rightIcon multiline disabled />`

| Prop | Type | Default |
|------|------|---------|
| error | `string` | — |
| helperText | `string` | — |
| required | `boolean` | `false` |
| leftIcon / rightIcon | `ReactNode` | — |

### Card
`<Card variant="elevated" padded><Text>contenido</Text></Card>`

| Prop | Type | Default |
|------|------|---------|
| variant | `elevated \| outlined \| ghost` | `elevated` |
| padded | `boolean` | `true` |

### Avatar
`<Avatar source={{uri}} name="Juan Pérez" size="md" variant="circle" />`

- Fallback a iniciales con color determinista
- `size: sm(32) | md(48) | lg(64) | xl(96)`
- `variant: circle | rounded | square`

### Badge
`<Badge label="Activo" variant="success" size="sm" dot leftIcon />`

| Prop | Type |
|------|------|
| variant | `default \| primary \| success \| warning \| error` |
| size | `sm \| md` |
| dot | `boolean` (punto de color) |
| leftIcon | `ReactNode` |

### Chip
`<Chip label="Filtro" selected onPress={fn} variant="filled" closable onClose={fn} />`

| Prop | Type | Default |
|------|------|---------|
| variant | `filled \| outline \| ghost` | `filled` |
| size | `sm \| md` | `md` |
| selected | `boolean` | `false` |
| closable | `boolean` | `false` |

### Modal
`<Modal visible title="Título" onClose={fn} size="md"><Text>contenido</Text></Modal>`

| Prop | Type | Default |
|------|------|---------|
| size | `sm \| md \| lg \| xl \| full` | `md` |
| animationType | `none \| fade \| slide` | `fade` |
| showCloseButton | `boolean` | `true` |

### Bottom Sheet
`<BottomSheet visible onClose={fn} snapPoint={0.5}><Text>contenido</Text></BottomSheet>`

- Drag para cerrar (PanResponder)
- `snapPoint` = fracción de la pantalla (ej. 0.5 = 50%)
- Overlay con opacidad animada

### Loader
`<Loader size="large" color="#10b981" variant="spinner" text="Cargando..." overlay fullScreen />`

| Prop | Type | Default |
|------|------|---------|
| variant | `spinner \| dots` | `spinner` |
| overlay | `boolean` | `false` |
| fullScreen | `boolean` | `false` |
| text | `string` | — |

`Spinner` se mantiene como alias de `Loader` con `variant="spinner"`.

### Skeleton
`<Skeleton width="75%" height={20} variant="text" borderRadius={4} />`

| Prop | Type | Default |
|------|------|---------|
| variant | `text \| circular \| rectangular` | `text` |

`<SkeletonGroup count={3} itemHeight={16} spacing={12} />` para listas.

### Header
`<Header title="Pantalla" subtitle="Subtítulo" leftAction={<Text>←</Text>} onLeftPress={fn} rightActions={[{icon, onPress, key}]} />`

- Safe area insets automáticos
- Layout: leftAction | title/subtitle (centro) | rightActions

### SearchBar
`<SearchBar value={v} onChangeText={fn} placeholder="Buscar..." showCancel onCancel={fn} autoFocus />`

- Icono de lupa, botón de limpiar
- `showCancel` muestra botón "Cancelar" al focus

### Select
`<Select label="Opción" options={[{label, value}]} onSelect={fn} multiple searchable placeholder error />`

- Abre un Modal con FlatList de opciones
- `multiple` permite multi-selección con Chips
- `searchable` agrega SearchBar interno

### DatePicker
`<DatePicker value={date} onChange={fn} mode="date" label="Fecha" minDate maxDate error />`

- Custom calendar dentro de Modal
- Navegación mes a mes
- Días deshabilitados según minDate/maxDate

### OTPInput
`<OTPInput length={6} value={v} onChange={fn} error disabled autoFocus />`

- 6 cajas individuales (configurable via `length`)
- Teclado numérico oculto
- Auto-focus al montar

### Toast
`<ToastProvider position="top">{children}</ToastProvider>`

Usar store: `useToastStore.getState().showToast("mensaje", "success")`

| Parámetro | Type | Default |
|-----------|------|---------|
| message | `string` | — |
| type | `success \| error \| warning \| info` | `info` |
| duration | `number` (ms) | `3000` |
| position | `top \| bottom` | `top` |

### LoadingOverlay
`<LoadingOverlay />` (global, ya en `_layout.tsx`)

Control: `useLoadingStore.getState().setLoading(true)`

### EmptyState
`<EmptyState title="Sin datos" description="No hay elementos" actionLabel="Crear" onAction={fn} />`

### ErrorBoundary
`<ErrorBoundary>{children}</ErrorBoundary>` (envuelve toda la app en `_layout.tsx`)

---

## Convenciones

- **Importar** desde `@/components/ui` (barrel export)
- **Class merging:** usar `twMerge` para combinar className externo
- **Temas:** usar clases de NativeWind (ej. `bg-primary-500`, `text-gray-900`)
- **No usar inline styles** salvo animaciones nativas con `Animated.View`
- **Iconos:** placeholder con caracteres Unicode; migrar a SVG cuando se definan los assets
- **No componentes de pantalla** en ui/ — solo primitivas reutilizables
