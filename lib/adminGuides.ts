export interface GuideStep {
  title: string;
  description: string;
  type?: 'info' | 'warning' | 'tip';
}

export interface AdminGuide {
  title: string;
  description: string;
  steps: GuideStep[];
  tips?: string[];
}

export const adminDashboardGuide: AdminGuide = {
  title: 'Panel de Administración',
  description: 'Vista general y métricas clave de la organización.',
  steps: [
    {
      title: 'Métricas Rápidas',
      description: 'Revise los indicadores principales como usuarios activos y estado de seguridad en la parte superior.',
      type: 'info'
    },
    {
      title: 'Accesos Directos',
      description: 'Utilice las tarjetas de acción rápida para navegar a las funciones más comunes como gestión de usuarios o configuración.',
      type: 'tip'
    }
  ],
  tips: [
    'Este panel es el punto de partida para cualquier tarea administrativa.',
    'Las métricas se actualizan en tiempo real o periódicamente.'
  ]
};

export const usersGuide: AdminGuide = {
  title: 'Gestión de Usuarios',
  description: 'Administre los usuarios, roles y accesos a la plataforma.',
  steps: [
    {
      title: 'Crear Usuario',
      description: 'Haga clic en "+ Nuevo Usuario", complete el nombre, email y seleccione el rol adecuado. Se enviará una invitación automática.',
      type: 'info'
    },
    {
      title: 'Importación Masiva',
      description: 'Use el botón "Importar CSV" para cargar múltiples usuarios a la vez. Asegúrese de seguir el formato de la plantilla.',
      type: 'tip'
    },
    {
      title: 'Gestión de Estado',
      description: 'Puede activar o desactivar usuarios desde el menú de acciones (tres puntos) en cada fila.',
      type: 'warning'
    },
    {
      title: 'Historial',
      description: 'Acceda a la pestaña "Actividad" o "Auditoría" para ver las acciones realizadas por cada usuario.',
      type: 'info'
    }
  ],
  tips: [
    'Use la búsqueda y filtros para encontrar usuarios rápidamente.',
    'Al reenviar credenciales, se generará una nueva contraseña temporal.'
  ]
};

export const unitsGuide: AdminGuide = {
  title: 'Estructura Organizacional',
  description: 'Defina la jerarquía de departamentos, áreas y procesos.',
  steps: [
    {
      title: 'Crear Unidades',
      description: 'Añada unidades organizativas (Departamentos, Áreas) definiendo su nombre, código y unidad padre.',
      type: 'info'
    },
    {
      title: 'Definir Procesos',
      description: 'Dentro de cada unidad, puede crear "Procesos" específicos que representen flujos de trabajo.',
      type: 'tip'
    },
    {
      title: 'Importación Jerárquica',
      description: 'Al importar vía CSV, asegúrese de incluir códigos únicos. El sistema ordenará automáticamente padres e hijos.',
      type: 'warning'
    }
  ],
  tips: [
    'Una estructura clara facilita la asignación de permisos y reportes.',
    'Use el código de la unidad para referencias rápidas (ej. DIR-FIN).'
  ]
};

export const rolesGuide: AdminGuide = {
  title: 'Roles y Permisos',
  description: 'Configure qué pueden hacer los usuarios según su nivel jerárquico.',
  steps: [
    {
      title: 'Matriz de Permisos',
      description: 'La tabla muestra los permisos (filas) y niveles (columnas). Marque las casillas para otorgar acceso.',
      type: 'info'
    },
    {
      title: 'Niveles Jerárquicos',
      description: 'Los permisos se asignan por Nivel (1-6), no por usuario individual, para mantener la consistencia.',
      type: 'warning'
    }
  ],
  tips: [
    'El Nivel 1 (Admin Tenant) tiene acceso total y no se puede restringir.',
    'Los cambios en permisos se aplican inmediatamente a todos los usuarios del nivel.'
  ]
};

export const settingsGuide: AdminGuide = {
  title: 'Configuración Global',
  description: 'Personalice la marca, correo y seguridad del entorno.',
  steps: [
    {
      title: 'Marca (Branding)',
      description: 'Suba el logo de su empresa y defina los colores corporativos para personalizar la interfaz.',
      type: 'info'
    },
    {
      title: 'Correo (SMTP)',
      description: 'Configure las credenciales SMTP para que la plataforma pueda enviar invitaciones y notificaciones.',
      type: 'warning'
    },
    {
      title: 'Seguridad',
      description: 'Defina políticas de contraseña y sesiones para proteger el acceso.',
      type: 'info'
    }
  ],
  tips: [
    'Siempre use el botón "Probar Conexión" al configurar el correo.',
    'Los cambios de marca son visibles para todos los usuarios de la organización.'
  ]
};

export const auditGuide: AdminGuide = {
  title: 'Auditoría del Sistema',
  description: 'Registro inmutable de todas las acciones críticas.',
  steps: [
    {
      title: 'Monitoreo',
      description: 'Revise la tabla cronológica para ver quién hizo qué y cuándo.',
      type: 'info'
    },
    {
      title: 'Filtros Avanzados',
      description: 'Filtre por tipo de evento, fecha o usuario para una investigación específica.',
      type: 'tip'
    },
    {
      title: 'Exportación',
      description: 'Descargue los registros en formato CSV para análisis externo o cumplimiento normativo.',
      type: 'info'
    }
  ],
  tips: [
    'Los registros de auditoría no se pueden eliminar ni modificar.',
    'Use el detalle (Metadata) para ver el contexto completo de un evento.'
  ]
};

export const communicationsGuide: AdminGuide = {
  title: 'Comunicaciones',
  description: 'Gestione las publicaciones y anuncios de su organización.',
  steps: [
    {
      title: 'Crear Publicación',
      description: 'Use el botón "Nueva Publicación" para redactar mensajes visibles para todos o grupos específicos.',
      type: 'info'
    },
    {
      title: 'Multimedia',
      description: 'Puede adjuntar imágenes, videos o documentos importantes a sus anuncios.',
      type: 'tip'
    },
    {
      title: 'Audiencia',
      description: 'Seleccione cuidadosamente quién puede ver la publicación (Todos o roles específicos).',
      type: 'warning'
    }
  ],
  tips: [
    'Las publicaciones importantes pueden fijarse al inicio.',
    'Use emojis para hacer los anuncios más amigables.'
  ]
};

export const storageDashboardGuide: AdminGuide = {
  title: 'Panel de Almacenamiento',
  description: 'Monitoree el uso de recursos y archivos.',
  steps: [
    {
      title: 'Visión General',
      description: 'Vea el espacio total utilizado y disponible de su plan.',
      type: 'info'
    },
    {
      title: 'Archivos Grandes',
      description: 'Identifique rápidamente qué archivos ocupan más espacio.',
      type: 'tip'
    }
  ],
  tips: [
    'Considere limpiar archivos antiguos periódicamente.',
    'La papelera ocupa espacio hasta que se vacía definitivamente.'
  ]
};

export const technicalSettingsGuide: AdminGuide = {
  title: 'Configuración Técnica',
  description: 'Opciones avanzadas de integración.',
  steps: [
    {
      title: 'Webhooks',
      description: 'Configure notificaciones automáticas a sistemas externos.',
      type: 'info'
    }
  ]
};

export const storageGuide: AdminGuide = {
  title: 'Proveedores de Almacenamiento',
  description: 'Conecte servicios externos como S3 o Google Drive.',
  steps: [
    {
      title: 'Credenciales',
      description: 'Ingrese las llaves de acceso de su proveedor de nube.',
      type: 'warning'
    }
  ]
};
