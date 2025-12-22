export interface AdminGuide {
  title: string;
  description: string;
  steps: string[];
  tips?: string[];
}

export const adminGeneralGuide: AdminGuide = {
  title: 'Configuracion General',
  description: 'Configure la apariencia y marca de su organizacion en la plataforma.',
  steps: [
    'Suba el logo de su organizacion',
    'Configure los colores primario y de acento',
    'Personalice el titulo de la aplicacion',
    'Configure el idioma y zona horaria predeterminados'
  ],
  tips: [
    'Use colores que representen la identidad de su marca',
    'El logo se mostrara en el menu lateral y pantalla de inicio'
  ]
};

export const usersGuide: AdminGuide = {
  title: 'Gestion de Usuarios',
  description: 'Administre los usuarios de su organizacion, sus roles y permisos.',
  steps: [
    'Haga clic en "Nuevo Usuario" para agregar un usuario',
    'Complete el formulario con los datos del usuario',
    'Seleccione el rol y nivel de acceso apropiado',
    'El usuario recibira una invitacion por correo electronico'
  ],
  tips: [
    'Puede importar usuarios masivamente usando un archivo CSV',
    'Los usuarios inactivos pueden ser suspendidos sin eliminarlos'
  ]
};

export const unitsGuide: AdminGuide = {
  title: 'Estructura Organizacional',
  description: 'Define la estructura jerarquica de su organizacion.',
  steps: [
    'Cree unidades principales primero (departamentos, areas)',
    'Agregue subunidades segun sea necesario',
    'Asigne responsables a cada unidad',
    'Configure los permisos por nivel'
  ],
  tips: [
    'Una estructura bien definida facilita la gestion de permisos',
    'Las unidades pueden representar departamentos, equipos o procesos'
  ]
};

export const rolesGuide: AdminGuide = {
  title: 'Roles y Permisos',
  description: 'Configure los permisos para cada nivel de usuario.',
  steps: [
    'Seleccione el nivel que desea configurar',
    'Active o desactive los permisos correspondientes',
    'Los cambios se aplicaran inmediatamente a los usuarios de ese nivel'
  ],
  tips: [
    'El nivel 1 (Admin) tiene todos los permisos por defecto',
    'Sea conservador al asignar permisos de eliminacion'
  ]
};

export const storageGuide: AdminGuide = {
  title: 'Configuracion de Almacenamiento',
  description: 'Configure el proveedor de almacenamiento para sus documentos.',
  steps: [
    'Seleccione el proveedor de almacenamiento',
    'Ingrese las credenciales de configuracion',
    'Pruebe la conexion antes de guardar',
    'Active el proveedor cuando este listo'
  ],
  tips: [
    'Google Drive y OneDrive requieren configuracion OAuth',
    'S3 es recomendado para grandes volumenes de archivos'
  ]
};

export const storageDashboardGuide: AdminGuide = {
  title: 'Panel de Almacenamiento',
  description: 'Monitoree el uso de almacenamiento de su organizacion.',
  steps: [
    'Revise el uso total y disponible',
    'Identifique los archivos mas grandes',
    'Configure alertas de uso si es necesario'
  ],
  tips: [
    'Realice limpiezas periodicas de archivos obsoletos',
    'Considere archivar documentos antiguos'
  ]
};

export const communicationsGuide: AdminGuide = {
  title: 'Comunicaciones',
  description: 'Gestione las publicaciones y anuncios de su organizacion.',
  steps: [
    'Cree una nueva publicacion haciendo clic en "Nueva Publicacion"',
    'Seleccione la audiencia objetivo',
    'Agregue contenido multimedia si es necesario',
    'Publique o guarde como borrador'
  ],
  tips: [
    'Las publicaciones importantes pueden destacarse',
    'Programe publicaciones para fechas futuras'
  ]
};

export const technicalSettingsGuide: AdminGuide = {
  title: 'Configuracion Tecnica',
  description: 'Configure integraciones y parametros tecnicos de la plataforma.',
  steps: [
    'Configure las integraciones SSO si aplica',
    'Establezca las politicas de seguridad',
    'Configure los webhooks necesarios'
  ],
  tips: [
    'SSO simplifica el inicio de sesion para sus usuarios',
    'Las integraciones mejoran la productividad'
  ]
};
