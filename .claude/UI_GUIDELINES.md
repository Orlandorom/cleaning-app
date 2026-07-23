# UI Guidelines — Cleaning App

## Overview

The project has two frontend applications:

1. **frontend-mobile/** — Expo SDK 52 (React Native) for client-facing mobile app
2. **frontend-admin/** — Vite 6 + React 19 for admin web dashboard

Both are currently **project scaffolds only** with no implemented features.

## Mobile App (`frontend-mobile/`)

### Stack

- Expo SDK 52
- React Native
- TypeScript

### Planned Screens

- **Splash / Onboarding** — First-time user introduction
- **Phone Login** — OTP-based authentication
- **Home** — Service catalog, featured providers
- **Service Detail** — Description, pricing, provider selection
- **Booking** — Date/time picker, address, confirmation
- **My Bookings** — List of past and upcoming bookings
- **Profile** — User info, settings

### Design Principles (Mobile)

- Native look and feel (iOS / Android platform conventions)
- Bottom tab navigation for primary sections
- Clean, minimal design with consistent spacing
- Primary color: Blue (#2563EB)
- All text in Spanish (the app targets the Colombian market)
- Responsive layouts using Flexbox

## Admin Dashboard (`frontend-admin/`)

### Stack

- Vite 6
- React 19
- TypeScript

### Planned Screens

- **Login** — Admin authentication
- **Dashboard** — Overview stats (bookings, revenue, active providers)
- **Cities** — CRUD table
- **Services** — CRUD table with type filter
- **Providers** — CRUD table with availability toggle
- **Clients** — CRUD table with search
- **Bookings** — Table with status filter, status update actions
- **Reviews** — Read-only list

### Design Principles (Admin)

- Sidebar navigation layout
- Data tables with sorting, filtering, and search
- Modal forms for create/edit operations
- Confirmation dialogs for destructive actions
- Status badges with color coding (PENDING= yellow, CONFIRMED= blue, IN_PROGRESS= orange, COMPLETED= green, CANCELLED= red)
- Responsive down to tablet size

## Reusable Components (Future)

### Shared Between Both Frontends

- **StatusBadge** — Color-coded badge for booking status
- **PhoneInput** — International phone number input with formatting
- **LoadingSpinner** — Consistent loading indicator
- **ErrorBoundary** — Graceful error handling
- **EmptyState** — Placeholder for empty lists

## API Integration

- Both frontends will use `fetch` or a lightweight HTTP client (not Axios, to keep bundles small).
- API base URL should be configurable via environment variable.
- All API calls handled through a centralized service layer (not inline in components).
- Error responses from the API displayed in a consistent toast/snackbar component.

## Code Organization

### Mobile

```
frontend-mobile/src/
├── screens/         # Screen components (one per route)
├── components/      # Reusable UI components
├── services/        # API service layer
├── navigation/      # Navigation configuration
├── hooks/           # Custom hooks
├── utils/           # Helpers, formatters
├── constants/       # Colors, typography, spacing
└── types/           # TypeScript interfaces
```

### Admin

```
frontend-admin/src/
├── pages/           # Page components (one per route)
├── components/      # Reusable UI components
├── services/        # API service layer
├── hooks/           # Custom hooks
├── utils/           # Helpers, formatters
├── styles/          # Global styles, theme
└── types/           # TypeScript interfaces
```

## Styling Approach

- **Mobile**: StyleSheet (React Native) or Tailwind-like utility via NativeWind (TBD).
- **Admin**: CSS Modules or Tailwind CSS (TBD).
- Consistency in spacing: use a 4px base unit (4, 8, 12, 16, 20, 24, 32, 48).
- Typography: System font stack for mobile, Inter or system fonts for admin.

## Accessibility

- All interactive elements must have accessible labels.
- Color contrast ratios must meet WCAG AA standards.
- Form inputs must have visible labels (not just placeholders).
- Error states must be communicated both visually and programmatically.
