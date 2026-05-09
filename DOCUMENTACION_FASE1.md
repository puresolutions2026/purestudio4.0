# Roadmap PureStudio 4.0 - Fase 1: Cimientos y Seguridad

Este documento detalla los pasos técnicos necesarios para establecer la base de datos y el sistema de permisos de PureStudio 4.0.

## Hito 1: Modelo de Datos y Esquema Firestore
**Objetivo:** Definir una estructura escalable que permita el multi-tenancy (múltiples colegios) y roles de usuario.

### Pasos:
1. **Colección `users`**:
   - Cada documento usará el `uid` de Firebase Auth como ID.
   - Campos: `email`, `role` (admin, tutor, student), `collegeId`, `createdAt`.
2. **Colección `colleges`**:
   - Almacenará la información de las instituciones.
   - Campos: `name`, `active`, `licenseType`.
3. **Colección `content` (Cursos/Material)**:
   - Vinculada por `collegeId` para asegurar que el contenido sea privado por institución.

---

## Hito 2: Autenticación y Gestión de Sesiones
**Objetivo:** Implementar un sistema de login seguro y persistente.

### Pasos:
1. **Configuración de Firebase SDK**: Inicialización en el frontend.
2. **Provider de Autenticación**: Implementar `Email/Password` y opcionalmente `Google Auth`.
3. **Custom Claims**: Configurar roles en el token JWT para máxima seguridad (opcional).

---

## Hito 3: Reglas de Seguridad (Security Rules)
**Objetivo:** Garantizar que ningún usuario acceda a datos que no le corresponden.

### Pasos:
1. **Validación de Rol**: Las reglas verificarán el campo `role` en el documento del usuario.
2. **Aislamiento por Colegio**: Un estudiante de 'Colegio A' no puede leer datos de 'Colegio B'.
3. **Jerarquía de Permisos**:
   - `Admin`: Lectura/Escritura total en su `collegeId`.
   - `Tutor`: Lectura de estudiantes y edición de contenido propio.
   - `Student`: Solo lectura de contenido asignado y su propio perfil.

---

## Próximos Pasos Técnicos
1. [ ] Instalación de dependencias de Firebase en `/frontend`.
2. [ ] Creación de `firestore.rules` en la raíz.
3. [ ] Setup del archivo `src/firebase/config.js` en el frontend.
