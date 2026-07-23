# Project Context — Cleaning App

> Documento de contexto de negocio. Describe el problema, los usuarios, los flujos y las reglas del negocio.

---

## 1. Objetivo del Negocio

Construir una **plataforma digital que conecte a personas que necesitan servicios de limpieza para el hogar u oficina con profesionales independientes que los ofrecen**, facilitando todo el ciclo: búsqueda, contratación, ejecución, pago y evaluación.

La plataforma opera como un **marketplace de servicios de aseo** donde:

- Los **clientes** encuentran, agendan y pagan servicios de limpieza.
- Los **prestadores** ofrecen sus servicios, gestionan su disponibilidad y reciben pagos.
- Los **administradores** supervisan, gestionan catálogos y resuelven incidencias.

---

## 2. Problema que Resuelve

### Problema Principal

En el mercado de servicios de limpieza doméstica y de oficinas en Latinoamérica, existen tres problemas fundamentales:

| Problema | Descripción |
|----------|-------------|
| **Informalidad** | La mayoría de los servicios de limpieza se contratan de manera informal (recomendaciones, referidos, redes sociales). No hay garantía de calidad, ni respaldo. |
| **Desconfianza** | Los clientes no tienen forma de verificar la reputación de un prestador antes de contratarlo. Los prestadores no tienen forma de demostrar su trayectoria. |
| **Ineficiencia** | Coordinar fechas, horarios, direcciones y precios se hace manualmente (WhatsApp, llamadas), lo que genera errores, malentendidos y pérdida de oportunidades. |

### Solución Propuesta

Una plataforma que:

1. **Digitaliza** todo el ciclo de contratación: catálogo → selección → agenda → pago → reseña.
2. **Genera confianza** mediante perfiles verificados, reseñas de otros clientes y un sistema de calificaciones.
3. **Optimiza** la operación con agenda centralizada, notificaciones automáticas y gestión de disponibilidad.

---

## 3. Usuarios del Sistema

### 3.1 Administrador

**Perfil:** Dueño de la plataforma o personal de operaciones.

**Necesidades:**
- Gestionar el catálogo de ciudades donde opera la plataforma.
- Gestionar el catálogo de servicios ofrecidos (tipos de limpieza, duración, descripción).
- Aprobar y supervisar prestadores registrados.
- Visualizar métricas del negocio (reservas, ingresos, prestadores activos).
- Resolver disputas entre clientes y prestadores.

**Alcance en plataforma:**
- Panel de administración web (`frontend-admin/`).
- Acceso completo a todos los módulos CRUD.
- Visibilidad de todas las reservas, clientes y prestadores.

### 3.2 Cliente

**Perfil:** Persona natural que necesita servicios de limpieza para su hogar u oficina.

**Necesidades:**
- Registrarse fácilmente con su número de teléfono (verificación vía OTP).
- Buscar servicios de limpieza disponibles en su ciudad.
- Ver perfiles de prestadores con calificaciones y reseñas.
- Agendar una reserva eligiendo fecha, hora y dirección.
- Recibir confirmación y recordatorios vía SMS.
- Calificar y reseñar el servicio recibido.
- Ver historial de sus reservas.

**Alcance en plataforma:**
- Aplicación móvil (`frontend-mobile/`).
- Autogestión: registro, búsqueda, reserva, pago, reseña.

**Dolor del usuario:**
- "No sé a quién llamar para limpiar mi casa que sea confiable."
- "Tuve una mala experiencia con un servicio que encontré por redes sociales y no tuve cómo reclamar."
- "Cada vez que necesito limpieza tengo que llamar a 3 personas para ver quién está disponible."

### 3.3 Prestador (Provider)

**Perfil:** Persona natural o jurídica que ofrece servicios de limpieza de manera independiente.

**Necesidades:**
- Registrarse con su número de teléfono y datos básicos.
- Indicar en qué ciudad(es) ofrece servicios.
- Definir qué servicios ofrece y a qué precio (ej. limpieza general: $80.000, limpieza profunda: $150.000).
- Marcar su disponibilidad (horarios, días laborales).
- Recibir notificaciones de nuevas reservas.
- Aceptar o rechazar reservas.
- Ver historial de servicios realizados.
- Recibir pagos por los servicios completados.

**Alcance en plataforma:**
- Aplicación móvil (misma app que clientes, con rol diferenciado) o web.
- Perfil público con calificación y reseñas.

**Dolor del usuario:**
- "Tengo clientes esporádicos pero me falta un flujo constante de trabajo."
- "Pierdo tiempo coordinando fechas y direcciones por WhatsApp."
- "No tengo una forma de demostrar que soy bueno en lo que hago."

---

## 4. Flujos del Negocio

### 4.1 Flujo de Registro

```
[ACTOR]           [ACCIÓN]                          [SISTEMA]
──────────────────────────────────────────────────────────────
Cliente           Ingresa número de teléfono         Envía OTP por SMS
                  Ingresa código OTP                 Verifica código
                  Completa perfil (nombre, email)    Crea cuenta
                  → FLUJO COMPLETO

Prestador         Ingresa número de teléfono         Envía OTP por SMS
                  Ingresa código OTP                 Verifica código
                  Completa perfil (nombre, email,    Crea cuenta
                  descripción, ciudad)
                  Define servicios y precios         Crea ProviderService
                  → FLUJO COMPLETO

Administrador     Ingresa credenciales              Verifica JWT
                  → FLUJO COMPLETO
```

### 4.2 Flujo de Reserva (Booking)

```
[ACTOR]           [ACCIÓN]                          [SISTEMA]
──────────────────────────────────────────────────────────────
Cliente           Explora servicios disponibles      Muestra catálogo
                  Selecciona servicio                Muestra prestadores disponibles
                  Selecciona prestador               Muestra perfil + reseñas
                  Elige fecha y hora                 Valida disponibilidad
                  Ingresa dirección                  —
                  Confirma reserva                   
                                                    Crea Booking (PENDING)
                                                    Notifica al prestador (SMS)
Prestador         Recibe notificación                —
                  Acepta reserva                     
                                                    Actualiza Booking (CONFIRMED)
                                                    Notifica al cliente (SMS)
                  → DÍA DE LA RESERVA
Prestador         Inicia servicio                    
                                                    Actualiza Booking (IN_PROGRESS)
Prestador         Completa servicio                  
                                                    Actualiza Booking (COMPLETED)
Cliente           Califica y comenta                 Crea Review
                  → FLUJO COMPLETO
```

### 4.3 Flujo de Cancelación

```
[ACTOR]           [ACCIÓN]                          [SISTEMA]
──────────────────────────────────────────────────────────────
Cliente/Prestador Solicita cancelación               —
                  (antes de IN_PROGRESS)             
                                                    Actualiza Booking (CANCELLED)
                                                    Notifica a la otra parte (SMS)
                  → FLUJO COMPLETO
```

### 4.4 Flujo de Verificación Telefónica (OTP)

```
[ACTOR]           [ACCIÓN]                          [SISTEMA]
──────────────────────────────────────────────────────────────
Usuario           Solicita código                    Genera OTP (6 dígitos, 10 min)
                                                    Almacena OTP en DB
                                                    Envía SMS con código
Usuario           Ingresa código                     
                                                    Busca OTP vigente
                                                    Verifica código
                                                    Si ok → marca verified
                                                    Si no → incrementa attempts
                                                    Si attempts ≥ 5 → bloquea
                  → FLUJO COMPLETO
```

---

## 5. Casos de Uso

### 5.1 Módulo Cliente

| ID | Caso de Uso | Actor | Descripción |
|----|------------|-------|-------------|
| CU-01 | Registrarse como cliente | Cliente | Registrar-se con teléfono + OTP |
| CU-02 | Iniciar sesión | Cliente | Autenticarse con teléfono + OTP |
| CU-03 | Ver perfil propio | Cliente | Consultar datos personales |
| CU-04 | Editar perfil | Cliente | Actualizar nombre, email |
| CU-05 | Buscar servicios | Cliente | Filtrar por tipo y ciudad |
| CU-06 | Ver detalle de servicio | Cliente | Ver descripción, duración, precio |
| CU-07 | Ver prestadores disponibles | Cliente | Listar prestadores por servicio |
| CU-08 | Ver perfil de prestador | Cliente | Ver nombre, calificación, reseñas |
| CU-09 | Crear reserva | Cliente | Seleccionar servicio, prestador, fecha, dirección |
| CU-10 | Ver mis reservas | Cliente | Listar reservas pasadas y futuras |
| CU-11 | Cancelar reserva | Cliente | Cancelar antes de IN_PROGRESS |
| CU-12 | Calificar servicio | Cliente | Puntuar (1-5) y comentar después de COMPLETED |

### 5.2 Módulo Prestador

| ID | Caso de Uso | Actor | Descripción |
|----|------------|-------|-------------|
| CU-13 | Registrarse como prestador | Prestador | Registrar-se con teléfono, datos y ciudad |
| CU-14 | Ver perfil propio | Prestador | Consultar datos personales y estadísticas |
| CU-15 | Editar perfil | Prestador | Actualizar datos, disponibilidad |
| CU-16 | Gestionar servicios ofrecidos | Prestador | Asignar/quitar servicios con precios |
| CU-17 | Ver reservas asignadas | Prestador | Listar reservas pendientes y realizadas |
| CU-18 | Aceptar reserva | Prestador | Confirmar disponibilidad |
| CU-19 | Iniciar servicio | Prestador | Marcar inicio en sitio |
| CU-20 | Completar servicio | Prestador | Marcar finalización |
| CU-21 | Cancelar reserva | Prestador | Cancelar antes de IN_PROGRESS |

### 5.3 Módulo Administrador

| ID | Caso de Uso | Actor | Descripción |
|----|------------|-------|-------------|
| CU-22 | Iniciar sesión | Admin | Autenticarse con credenciales |
| CU-23 | Gestionar ciudades | Admin | CRUD de ciudades |
| CU-24 | Gestionar servicios | Admin | CRUD de servicios |
| CU-25 | Gestionar prestadores | Admin | Ver, aprobar, suspender prestadores |
| CU-26 | Gestionar clientes | Admin | Ver y gestionar clientes |
| CU-27 | Visualizar reservas | Admin | Ver todas las reservas del sistema |
| CU-28 | Actualizar estado de reserva | Admin | Forzar cambio de estado (casos excepcionales) |
| CU-29 | Ver reseñas | Admin | Moderar reseñas reportadas |
| CU-30 | Ver dashboard | Admin | Métricas: reservas del día, ingresos, prestadores activos |

### 5.4 Módulo Transversal

| ID | Caso de Uso | Actor | Descripción |
|----|------------|-------|-------------|
| CU-31 | Recibir OTP | Todos | Recibir código de verificación por SMS |
| CU-32 | Verificar OTP | Todos | Validar código ingresado |
| CU-33 | Recibir notificación | Cliente/Prestador | SMS de confirmación, recordatorio, cambio de estado |

---

## 6. Reglas del Negocio

### 6.1 Reglas de Catálogo

| ID | Regla | Descripción |
|----|-------|-------------|
| RN-01 | Ciudad única | No pueden existir dos ciudades con el mismo nombre. |
| RN-02 | Servicio único | No pueden existir dos servicios con el mismo nombre. |
| RN-03 | Tipos de servicio | Los servicios se clasifican en: GENERAL, DEEP, CARPET, WINDOW, OFFICE. |
| RN-04 | Duración mínima | Un servicio debe durar al menos 15 minutos. |
| RN-05 | Ciudad obligatoria | Un prestador debe estar asociado a una ciudad. |

### 6.2 Reglas de Usuarios

| ID | Regla | Descripción |
|----|-------|-------------|
| RN-06 | Teléfono único | No pueden existir dos clientes ni dos prestadores con el mismo teléfono. |
| RN-07 | Formato teléfono | El teléfono debe estar en formato internacional (+573001234567). |
| RN-08 | Verificación obligatoria | Para registrarse o iniciar sesión, el teléfono debe verificarse vía OTP. |
| RN-09 | OTP expira | El código OTP expira después de 10 minutos. |
| RN-10 | Límite de intentos OTP | Máximo 5 intentos de verificación por código OTP. |
| RN-11 | Prestador requiere ciudad | Un prestador no puede registrarse sin indicar una ciudad. |

### 6.3 Reglas de Reservas

| ID | Regla | Descripción |
|----|-------|-------------|
| RN-12 | Reserva requiere entidades válidas | Una reserva debe tener un cliente, prestador y servicio existentes. |
| RN-13 | Ciclo de vida estricto | Una reserva sigue el flujo: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED. |
| RN-14 | Cancelación permitida | Se puede cancelar desde PENDING o CONFIRMED. No desde IN_PROGRESS. |
| RN-15 | Precio no negativo | El precio total de una reserva no puede ser negativo. |
| RN-16 | Fecha programada obligatoria | Toda reserva debe tener una fecha y hora programada. |
| RN-17 | Dirección obligatoria | Toda reserva debe incluir una dirección de servicio. |

### 6.4 Reglas de Reseñas

| ID | Regla | Descripción |
|----|-------|-------------|
| RN-18 | Una reseña por reserva | Cada reserva solo puede tener una reseña. |
| RN-19 | Solo después de completar | Solo se puede reseñar una reserva en estado COMPLETED. |
| RN-20 | Puntaje 1-5 | La calificación debe ser un número entero entre 1 y 5. |
| RN-21 | La reseña es pública | Cualquier usuario puede ver las reseñas de un prestador. |

### 6.5 Reglas de Pago (Futuro)

| ID | Regla | Descripción |
|----|-------|-------------|
| RN-22 | Pago antes del servicio | El cliente debe pagar antes de que el servicio inicie (IN_PROGRESS). |
| RN-23 | Retención | La plataforma retiene el pago hasta que el servicio se complete. |
| RN-24 | Comisión | La plataforma cobra una comisión por cada transacción (% a definir). |

### 6.6 Reglas de Notificaciones

| ID | Regla | Descripción |
|----|-------|-------------|
| RN-25 | Confirmación al crear | Cuando se crea una reserva, se notifica al prestador. |
| RN-26 | Confirmación al aceptar | Cuando el prestador acepta, se notifica al cliente. |
| RN-27 | Recordatorio | 24 horas antes de la fecha programada, se notifica a ambas partes. |
| RN-28 | Notificación de cancelación | Cuando se cancela, se notifica a la otra parte. |

---

## 7. Roadmap Funcional

### Fase 1: Fundación (Completada ✅)

| Funcionalidad | Módulo | Prioridad |
|--------------|--------|-----------|
| Catálogo de ciudades | Cities | Alta |
| Catálogo de servicios | Services | Alta |
| Registro y gestión de prestadores | Providers | Alta |
| Registro y gestión de clientes | Clients | Alta |
| Sistema de reservas | Bookings | Alta |
| Verificación telefónica (OTP) | SMS | Alta |
| Documentación API (Swagger) | — | Alta |

### Fase 2: Autenticación y Seguridad (Siguiente 🔜)

| Funcionalidad | Módulo | Prioridad |
|--------------|--------|-----------|
| Registro de usuarios con OTP | Auth | Alta |
| Inicio de sesión con JWT | Auth | Alta |
| Guards de autenticación | Auth | Alta |
| Roles (cliente, prestador, admin) | Auth | Alta |

### Fase 3: Experiencia de Reserva (Pendiente 🔜)

| Funcionalidad | Módulo | Prioridad |
|--------------|--------|-----------|
| Asignación de servicios a prestadores con precios | ProviderService | Alta |
| Aceptación/rechazo de reservas por prestador | Bookings | Alta |
| Ciclo completo de estados (CONFIRMED → IN_PROGRESS → COMPLETED) | Bookings | Alta |
| Sistema de reseñas y calificaciones | Reviews | Alta |

### Fase 4: Frontend Mobile (Pendiente 📝)

| Funcionalidad | Plataforma | Prioridad |
|--------------|-----------|-----------|
| Autenticación con OTP | Mobile | Alta |
| Búsqueda y exploración de servicios | Mobile | Alta |
| Flujo de reserva completo | Mobile | Alta |
| Perfil de usuario | Mobile | Media |
| Historial de reservas | Mobile | Media |
| Notificaciones push | Mobile | Media |

### Fase 5: Frontend Admin (Pendiente 📝)

| Funcionalidad | Plataforma | Prioridad |
|--------------|-----------|-----------|
| Dashboard con métricas | Admin | Alta |
| CRUD de ciudades | Admin | Alta |
| CRUD de servicios | Admin | Alta |
| CRUD de prestadores | Admin | Alta |
| CRUD de clientes | Admin | Alta |
| Gestión de reservas | Admin | Alta |
| Moderación de reseñas | Admin | Media |

### Fase 6: Pagos y Monetización (Pendiente 📝)

| Funcionalidad | Módulo | Prioridad |
|--------------|--------|-----------|
| Integración con pasarela de pagos | Payments | Alta |
| Pago anticipado del cliente | Payments | Alta |
| Liberación de pago al prestador | Payments | Alta |
| Comisión de plataforma | Payments | Alta |
| Facturación electrónica | Payments | Media |

### Fase 7: Madurez Operativa (Pendiente 📝)

| Funcionalidad | Área | Prioridad |
|--------------|------|-----------|
| Notificaciones push (mobile) | Mobile | Media |
| Recordatorios automáticos (SMS) | SMS | Media |
| Búsqueda avanzada (filtros múltiples) | API | Media |
| Paginación en listados | API | Media |
| Panel de analíticas avanzado | Admin | Baja |
| Múltiples idiomas | General | Baja |
| Programa de referidos | General | Baja |

---

## 8. Modelo de Ingresos (Propuesta)

| Fuente | Descripción |
|--------|-------------|
| **Comisión por servicio** | Porcentaje (10-20%) sobre el valor de cada reserva completada. |
| **Suscripción premium** | Los prestadores pagan una suscripción mensual por mayor visibilidad y funciones avanzadas. |
| **Destacados** | Los prestadores pagan por aparecer primero en los resultados de búsqueda. |

---

## 9. Métricas Clave (KPIs)

| KPI | Descripción | Meta sugerida |
|-----|-------------|---------------|
| Reservas completadas/día | Volumen de operaciones | — |
| Tasa de aceptación | % de reservas aceptadas por prestadores | > 80% |
| Tasa de cancelación | % de reservas canceladas | < 10% |
| Calificación promedio | Promedio de reseñas (1-5) | > 4.2 |
| Tiempo de respuesta | Tiempo entre reserva y aceptación | < 30 min |
| Clientes recurrentes | % de clientes con más de 1 reserva | > 40% |
| Prestadores activos/semana | Prestadores con al menos 1 servicio/semana | — |

---

## 10. Stack Tecnológico (Resumen)

| Capa | Tecnología |
|------|-----------|
| Backend | NestJS v11 + TypeScript |
| Base de datos | PostgreSQL (Neon serverless) |
| ORM | Prisma v6 |
| SMS | Twilio |
| API Docs | Swagger (@nestjs/swagger) |
| Auth | JWT + Passport |
| Mobile | Expo SDK 52 + React Native + NativeWind |
| Admin Web | Vite 6 + React 19 |
| Tests | Jest + ts-jest |

---

*Documento de contexto de negocio — Cleaning App.*
*Versión: 1.0 — Julio 2026.*
