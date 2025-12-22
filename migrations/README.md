# Database Migrations

Este directorio contiene las migraciones de base de datos generadas por Drizzle Kit.

## Comandos

```bash
# Generar y aplicar migraciones
npm run db:migrate

# Solo aplicar cambios de esquema (sin generar archivos)
npm run db:push

# Ver/editar datos en la base de datos
npm run db:studio

# Seed de datos de desarrollo (SOLO para desarrollo)
npm run db:seed:dev

# Seed mínimo para producción
npm run db:seed:prod
```

## Flujo de Migraciones

### Desarrollo
1. Modificar el esquema en `shared/schema.ts`
2. Ejecutar `npm run db:push` para aplicar cambios
3. Probar los cambios localmente
4. Commit del esquema actualizado

### Producción
1. Los cambios de esquema se aplican automáticamente con `npm run build:prod`
2. El seed de producción solo crea el Super Admin si no existe
3. Nunca ejecutar `db:seed:dev` en producción

## Reglas de Seguridad

1. **Nunca** conectar desarrollo a base de datos de producción
2. **Nunca** copiar datos de producción a desarrollo
3. **Siempre** usar seeders para datos de prueba
4. **Siempre** tener un plan de rollback para cambios de esquema

## Estructura de Datos

### Datos de Desarrollo (seeders)
- Tenants de prueba: demo, alpha, algoritmot
- Usuarios ficticios con contraseñas de prueba
- Documentos, workflows y encuestas de ejemplo

### Datos de Producción
- Solo Super Admin inicial
- Tenants creados por usuarios reales
- Datos sensibles encriptados

## Variables de Entorno

| Variable | Desarrollo | Producción |
|----------|------------|------------|
| DATABASE_URL | Requerida | Requerida |
| EMAIL_ENCRYPTION_KEY | Opcional | Requerida |
| STORAGE_ENCRYPTION_KEY | Opcional | Requerida |
| NODE_ENV | development | production |
