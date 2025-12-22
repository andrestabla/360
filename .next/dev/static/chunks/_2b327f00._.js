(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/i18n.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTranslation",
    ()=>getTranslation,
    "useTranslation",
    ()=>useTranslation
]);
const translations = {
    es: {
        dashboard: 'Panel Principal',
        home: 'Inicio',
        workflows: 'Flujos de Trabajo',
        repository: 'Repositorio',
        chat: 'Chat',
        analytics: 'Analíticas',
        surveys: 'Encuestas',
        profile: 'Perfil',
        settings: 'Configuración',
        logout: 'Cerrar Sesión',
        admin: 'Administración',
        users: 'Usuarios',
        units: 'Unidades',
        roles: 'Roles',
        storage: 'Almacenamiento',
        communications: 'Comunicaciones',
        audit: 'Auditoría',
        tenants: 'Organizaciones',
        platform: 'Plataforma',
        nav_operation: 'OPERACIÓN',
        nav_governance: 'GOBERNANZA',
        nav_management: 'GESTIÓN',
        nav_platform: 'PLATAFORMA',
        nav_dashboard: 'Inicio',
        nav_chat: 'Chat',
        nav_chat0: 'Chat',
        nav_repository: 'Repositorio',
        nav_workflows: 'Mis Flujos',
        nav_analytics: 'Analíticas',
        nav_surveys: 'Encuestas',
        nav_admin: 'Administración',
        nav_units: 'Unidades',
        nav_roles: 'Roles',
        nav_users: 'Usuarios',
        nav_comms: 'Comunicaciones',
        nav_unit: 'Mi Unidad',
        nav_settings: 'Configuración',
        nav_storage: 'Almacenamiento',
        nav_audit: 'Auditoría',
        nav_projects: 'Proyectos',
        nav_requests: 'Solicitudes',
        search: 'Buscar',
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        create: 'Crear',
        add: 'Agregar',
        close: 'Cerrar',
        confirm: 'Confirmar',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        warning: 'Advertencia',
        info: 'Información',
        welcome: 'Bienvenido',
        documents: 'Documentos',
        projects: 'Proyectos',
        activities: 'Actividades',
        phases: 'Fases',
        status: 'Estado',
        active: 'Activo',
        inactive: 'Inactivo',
        pending: 'Pendiente',
        completed: 'Completado',
        archived: 'Archivado',
        all: 'Todos',
        filter: 'Filtrar',
        sort: 'Ordenar',
        export: 'Exportar',
        import: 'Importar',
        download: 'Descargar',
        upload: 'Subir',
        view: 'Ver',
        details: 'Detalles',
        description: 'Descripción',
        name: 'Nombre',
        email: 'Correo',
        phone: 'Teléfono',
        date: 'Fecha',
        time: 'Hora',
        type: 'Tipo',
        category: 'Categoría',
        tags: 'Etiquetas',
        comments: 'Comentarios',
        likes: 'Me gusta',
        share: 'Compartir',
        notifications: 'Notificaciones',
        messages: 'Mensajes',
        newMessage: 'Nuevo Mensaje',
        send: 'Enviar',
        reply: 'Responder',
        forward: 'Reenviar',
        attach: 'Adjuntar',
        myUnit: 'Mi Unidad',
        myTeam: 'Mi Equipo',
        myProjects: 'Mis Proyectos',
        myTasks: 'Mis Tareas',
        recentActivity: 'Actividad Reciente',
        quickActions: 'Acciones Rápidas',
        overview: 'Resumen',
        reports: 'Reportes',
        help: 'Ayuda',
        support: 'Soporte',
        documentation: 'Documentación',
        version: 'Versión',
        language: 'Idioma',
        theme: 'Tema',
        dark: 'Oscuro',
        light: 'Claro',
        auto: 'Automático',
        wf_title_requests: 'Solicitudes',
        wf_title_projects: 'Proyectos',
        wf_desc_requests: 'Gestiona las solicitudes de tu equipo',
        wf_desc_projects: 'Organiza y da seguimiento a tus proyectos',
        wf_new_request: 'Nueva Solicitud',
        wf_new_project: 'Nuevo Proyecto',
        wf_new_folder: 'Nueva Carpeta',
        wf_import: 'Importar',
        surveys_title: 'Encuestas',
        surveys_desc: 'Crea y gestiona encuestas para tu organización',
        surveys_create_btn: 'Nueva Encuesta',
        surveys_tab_active: 'Activas',
        surveys_tab_drafts: 'Borradores',
        surveys_tab_closed: 'Cerradas',
        surveys_cancel: 'Cancelar',
        surveys_template_title: 'Crear desde Plantilla',
        surveys_template_subtitle: 'Selecciona una plantilla para comenzar',
        survey_yes: 'Sí',
        survey_no: 'No',
        survey_next_btn: 'Siguiente',
        survey_prev_btn: 'Anterior',
        survey_finish_btn: 'Finalizar',
        survey_next_dim_btn: 'Siguiente Dimensión',
        survey_dropdown_placeholder: 'Selecciona una opción',
        survey_required: 'Requerido',
        survey_respond_btn: 'Responder',
        survey_view_results: 'Ver Resultados',
        survey_completed: 'Completada',
        survey_completed_btn: 'Completada',
        survey_exit: 'Salir',
        survey_saving: 'Guardando...',
        survey_saved: 'Guardado',
        survey_questions_count: 'preguntas',
        survey_sections: 'secciones',
        survey_page_info: 'Página',
        survey_page_of: 'de',
        survey_audience_global: 'Global',
        survey_audience_unit: 'Por Unidad',
        survey_global_progress: 'Progreso Global',
        survey_empty_title: 'No hay encuestas',
        survey_empty_create_first: 'Crea tu primera encuesta',
        survey_thank_you_title: '¡Gracias!',
        survey_thank_you_desc: 'Tu respuesta ha sido registrada',
        survey_text_placeholder: 'Escribe tu respuesta aquí...',
        survey_likert_agree: 'Totalmente de acuerdo',
        survey_likert_disagree: 'Totalmente en desacuerdo',
        survey_nps_likely: 'Muy probable',
        survey_nps_unlikely: 'Muy improbable',
        builder_tab_design: 'Diseño',
        builder_tab_settings: 'Configuración',
        builder_publish: 'Publicar',
        builder_question_types: 'Tipos de Pregunta',
        builder_new_question: 'Nueva Pregunta',
        builder_no_questions: 'Sin preguntas',
        builder_ph_title: 'Título de la encuesta',
        builder_ph_desc: 'Descripción de la encuesta',
        builder_q_ph: 'Escribe tu pregunta...',
        builder_required: 'Requerida',
        builder_delete_q: 'Eliminar',
        builder_select_type: 'Selecciona tipo',
        builder_add_option: 'Agregar opción',
        builder_text_help: 'Texto de ayuda',
        builder_settings_header: 'Configuración',
        builder_audience_label: 'Audiencia',
        builder_audience_global_btn: 'Global',
        builder_audience_unit_btn: 'Por Unidad',
        builder_type_free_text: 'Texto Libre',
        builder_type_likert: 'Escala Likert',
        builder_type_nps_full: 'NPS (0-10)',
        builder_type_multi: 'Opción Múltiple',
        builder_type_check: 'Casillas',
        builder_type_yesno: 'Sí/No',
        builder_type_rating: 'Calificación',
        builder_type_dropdown: 'Desplegable',
        builder_type_ranking: 'Ranking',
        builder_type_date: 'Fecha',
        builder_type_file: 'Archivo',
        results_tab_general: 'General',
        results_tab_dimensions: 'Dimensiones',
        results_tab_analytics: 'Análisis',
        results_tab_actions: 'Acciones',
        results_aiq: 'AIQ',
        results_aiq_desc: 'Índice de Agilidad',
        results_dq: 'DQ',
        results_dq_desc: 'Índice Digital',
        results_benchmark_title: 'Benchmark',
        results_benchmark_sector: 'Sector',
        results_benchmark_expected: 'Esperado',
        badge_high: 'Alto',
        badge_medium: 'Medio',
        badge_low: 'Bajo',
        profile_title: 'Mi Perfil',
        profile_tab_info: 'Información',
        profile_tab_security: 'Seguridad',
        profile_name: 'Nombre',
        profile_bio: 'Biografía',
        profile_phone: 'Teléfono',
        profile_location: 'Ubicación',
        profile_lang: 'Idioma',
        profile_timezone: 'Zona Horaria',
        profile_regional: 'Regional',
        profile_level: 'Nivel',
        profile_last_access: 'Último Acceso',
        profile_today: 'Hoy',
        profile_active: 'Activo',
        profile_save_btn: 'Guardar Cambios',
        profile_saved: 'Guardado',
        profile_change_photo: 'Cambiar Foto',
        security_password_title: 'Cambiar Contraseña',
        security_current_pass: 'Contraseña Actual',
        security_new_pass: 'Nueva Contraseña',
        security_confirm_pass: 'Confirmar Contraseña',
        security_change_btn: 'Cambiar Contraseña',
        security_pass_mismatch: 'Las contraseñas no coinciden',
        security_mfa_title: 'Autenticación de Dos Factores',
        security_mfa_desc: 'Agrega una capa extra de seguridad',
        security_mfa_enable: 'Habilitar 2FA',
        security_activity_title: 'Actividad Reciente',
        security_activity_desc: 'Historial de sesiones',
        repo_upload_title: 'Subir Archivo',
        repo_upload_btn: 'Subir',
        repo_search_placeholder: 'Buscar documentos...',
        repo_filter_type: 'Tipo',
        repo_filter_favorites: 'Favoritos',
        repo_filter_clear: 'Limpiar',
        repo_empty_title: 'Sin documentos',
        repo_empty_desc: 'Sube tu primer documento',
        repo_tab_file: 'Archivo',
        repo_tab_link: 'Enlace',
        repo_tab_embed: 'Incrustado',
        doc_viewer_comments: 'Comentarios',
        doc_viewer_upload_new: 'Subir Nueva Versión'
    },
    en: {
        dashboard: 'Dashboard',
        home: 'Home',
        workflows: 'Workflows',
        repository: 'Repository',
        chat: 'Chat',
        analytics: 'Analytics',
        surveys: 'Surveys',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
        admin: 'Admin',
        users: 'Users',
        units: 'Units',
        roles: 'Roles',
        storage: 'Storage',
        communications: 'Communications',
        audit: 'Audit',
        tenants: 'Organizations',
        platform: 'Platform',
        nav_operation: 'OPERATION',
        nav_governance: 'GOVERNANCE',
        nav_management: 'MANAGEMENT',
        nav_platform: 'PLATFORM',
        nav_dashboard: 'Dashboard',
        nav_chat: 'Chat',
        nav_chat0: 'Chat',
        nav_repository: 'Repository',
        nav_workflows: 'My Workflows',
        nav_analytics: 'Analytics',
        nav_surveys: 'Surveys',
        nav_admin: 'Admin',
        nav_units: 'Units',
        nav_roles: 'Roles',
        nav_users: 'Users',
        nav_comms: 'Communications',
        nav_unit: 'My Unit',
        nav_settings: 'Settings',
        nav_storage: 'Storage',
        nav_audit: 'Audit',
        nav_projects: 'Projects',
        nav_requests: 'Requests',
        search: 'Search',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        add: 'Add',
        close: 'Close',
        confirm: 'Confirm',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',
        welcome: 'Welcome',
        documents: 'Documents',
        projects: 'Projects',
        activities: 'Activities',
        phases: 'Phases',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        completed: 'Completed',
        archived: 'Archived',
        all: 'All',
        filter: 'Filter',
        sort: 'Sort',
        export: 'Export',
        import: 'Import',
        download: 'Download',
        upload: 'Upload',
        view: 'View',
        details: 'Details',
        description: 'Description',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        date: 'Date',
        time: 'Time',
        type: 'Type',
        category: 'Category',
        tags: 'Tags',
        comments: 'Comments',
        likes: 'Likes',
        share: 'Share',
        notifications: 'Notifications',
        messages: 'Messages',
        newMessage: 'New Message',
        send: 'Send',
        reply: 'Reply',
        forward: 'Forward',
        attach: 'Attach',
        myUnit: 'My Unit',
        myTeam: 'My Team',
        myProjects: 'My Projects',
        myTasks: 'My Tasks',
        recentActivity: 'Recent Activity',
        quickActions: 'Quick Actions',
        overview: 'Overview',
        reports: 'Reports',
        help: 'Help',
        support: 'Support',
        documentation: 'Documentation',
        version: 'Version',
        language: 'Language',
        theme: 'Theme',
        dark: 'Dark',
        light: 'Light',
        auto: 'Auto',
        wf_title_requests: 'Requests',
        wf_title_projects: 'Projects',
        wf_desc_requests: 'Manage your team requests',
        wf_desc_projects: 'Organize and track your projects',
        wf_new_request: 'New Request',
        wf_new_project: 'New Project',
        wf_new_folder: 'New Folder',
        wf_import: 'Import',
        surveys_title: 'Surveys',
        surveys_desc: 'Create and manage surveys for your organization',
        surveys_create_btn: 'New Survey',
        surveys_tab_active: 'Active',
        surveys_tab_drafts: 'Drafts',
        surveys_tab_closed: 'Closed',
        surveys_cancel: 'Cancel',
        surveys_template_title: 'Create from Template',
        surveys_template_subtitle: 'Select a template to get started',
        survey_yes: 'Yes',
        survey_no: 'No',
        survey_next_btn: 'Next',
        survey_prev_btn: 'Previous',
        survey_finish_btn: 'Finish',
        survey_next_dim_btn: 'Next Dimension',
        survey_dropdown_placeholder: 'Select an option',
        survey_required: 'Required',
        survey_respond_btn: 'Respond',
        survey_view_results: 'View Results',
        survey_completed: 'Completed',
        survey_completed_btn: 'Completed',
        survey_exit: 'Exit',
        survey_saving: 'Saving...',
        survey_saved: 'Saved',
        survey_questions_count: 'questions',
        survey_sections: 'sections',
        survey_page_info: 'Page',
        survey_page_of: 'of',
        survey_audience_global: 'Global',
        survey_audience_unit: 'By Unit',
        survey_global_progress: 'Global Progress',
        survey_empty_title: 'No surveys',
        survey_empty_create_first: 'Create your first survey',
        survey_thank_you_title: 'Thank you!',
        survey_thank_you_desc: 'Your response has been recorded',
        survey_text_placeholder: 'Write your answer here...',
        survey_likert_agree: 'Strongly agree',
        survey_likert_disagree: 'Strongly disagree',
        survey_nps_likely: 'Very likely',
        survey_nps_unlikely: 'Very unlikely',
        builder_tab_design: 'Design',
        builder_tab_settings: 'Settings',
        builder_publish: 'Publish',
        builder_question_types: 'Question Types',
        builder_new_question: 'New Question',
        builder_no_questions: 'No questions',
        builder_ph_title: 'Survey title',
        builder_ph_desc: 'Survey description',
        builder_q_ph: 'Write your question...',
        builder_required: 'Required',
        builder_delete_q: 'Delete',
        builder_select_type: 'Select type',
        builder_add_option: 'Add option',
        builder_text_help: 'Help text',
        builder_settings_header: 'Settings',
        builder_audience_label: 'Audience',
        builder_audience_global_btn: 'Global',
        builder_audience_unit_btn: 'By Unit',
        builder_type_free_text: 'Free Text',
        builder_type_likert: 'Likert Scale',
        builder_type_nps_full: 'NPS (0-10)',
        builder_type_multi: 'Multiple Choice',
        builder_type_check: 'Checkboxes',
        builder_type_yesno: 'Yes/No',
        builder_type_rating: 'Rating',
        builder_type_dropdown: 'Dropdown',
        builder_type_ranking: 'Ranking',
        builder_type_date: 'Date',
        builder_type_file: 'File',
        results_tab_general: 'General',
        results_tab_dimensions: 'Dimensions',
        results_tab_analytics: 'Analytics',
        results_tab_actions: 'Actions',
        results_aiq: 'AIQ',
        results_aiq_desc: 'Agility Index',
        results_dq: 'DQ',
        results_dq_desc: 'Digital Index',
        results_benchmark_title: 'Benchmark',
        results_benchmark_sector: 'Sector',
        results_benchmark_expected: 'Expected',
        badge_high: 'High',
        badge_medium: 'Medium',
        badge_low: 'Low',
        profile_title: 'My Profile',
        profile_tab_info: 'Information',
        profile_tab_security: 'Security',
        profile_name: 'Name',
        profile_bio: 'Bio',
        profile_phone: 'Phone',
        profile_location: 'Location',
        profile_lang: 'Language',
        profile_timezone: 'Timezone',
        profile_regional: 'Regional',
        profile_level: 'Level',
        profile_last_access: 'Last Access',
        profile_today: 'Today',
        profile_active: 'Active',
        profile_save_btn: 'Save Changes',
        profile_saved: 'Saved',
        profile_change_photo: 'Change Photo',
        security_password_title: 'Change Password',
        security_current_pass: 'Current Password',
        security_new_pass: 'New Password',
        security_confirm_pass: 'Confirm Password',
        security_change_btn: 'Change Password',
        security_pass_mismatch: 'Passwords do not match',
        security_mfa_title: 'Two-Factor Authentication',
        security_mfa_desc: 'Add an extra layer of security',
        security_mfa_enable: 'Enable 2FA',
        security_activity_title: 'Recent Activity',
        security_activity_desc: 'Session history',
        repo_upload_title: 'Upload File',
        repo_upload_btn: 'Upload',
        repo_search_placeholder: 'Search documents...',
        repo_filter_type: 'Type',
        repo_filter_favorites: 'Favorites',
        repo_filter_clear: 'Clear',
        repo_empty_title: 'No documents',
        repo_empty_desc: 'Upload your first document',
        repo_tab_file: 'File',
        repo_tab_link: 'Link',
        repo_tab_embed: 'Embed',
        doc_viewer_comments: 'Comments',
        doc_viewer_upload_new: 'Upload New Version'
    }
};
function useTranslation(locale = 'es') {
    const t = (key)=>{
        return translations[locale]?.[key] || translations['es']?.[key] || key;
    };
    return {
        t,
        locale
    };
}
function getTranslation(key, locale = 'es') {
    return translations[locale]?.[key] || translations['es']?.[key] || key;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/i18n.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$SquaresFour$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/SquaresFour.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Planet$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Planet.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Buildings$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Buildings.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ShieldCheck$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/ShieldCheck.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ChatCircleDots$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/ChatCircleDots.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Files$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Files.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$GitPullRequest$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/GitPullRequest.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Gear$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Gear.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$UsersThree$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/UsersThree.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$TreeStructure$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/TreeStructure.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Megaphone$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Megaphone.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Kanban$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Kanban.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ChartPieSlice$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/ChartPieSlice.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ClipboardText$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/ClipboardText.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CaretLeft$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/CaretLeft.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CaretRight$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/CaretRight.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Globe$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Globe.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CloudArrowUp$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/CloudArrowUp.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$X$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/X.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function Sidebar() {
    _s();
    const { currentUser, isSuperAdmin, currentTenant, isSidebarCollapsed, toggleSidebar, unreadChatCount, isMobileMenuOpen, closeMobileMenu } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    if (!currentUser) return null;
    const handleNavigation = (path)=>{
        router.push(path);
        closeMobileMenu();
    };
    const NavItem = ({ icon: Icon, label, path, badge })=>{
        const isActive = pathname === path;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            id: `nav-item-${path.replace(/\//g, '-')}`,
            className: `nav-item ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`,
            onClick: ()=>handleNavigation(path),
            title: isSidebarCollapsed ? label : '',
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    size: isSidebarCollapsed ? 22 : 18,
                    weight: isActive ? 'bold' : 'regular'
                }, void 0, false, {
                    fileName: "[project]/components/Sidebar.tsx",
                    lineNumber: 33,
                    columnNumber: 17
                }, this),
                !isSidebarCollapsed && label,
                !isSidebarCollapsed && badge && badge !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "nav-badge mx-2",
                    children: badge
                }, void 0, false, {
                    fileName: "[project]/components/Sidebar.tsx",
                    lineNumber: 35,
                    columnNumber: 65
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Sidebar.tsx",
            lineNumber: 27,
            columnNumber: 13
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            isMobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 z-40 lg:hidden",
                onClick: closeMobileMenu
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 43,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                id: "sidebar",
                className: `
                    ${isSuperAdmin ? 'super-mode' : ''} 
                    ${isSidebarCollapsed ? 'collapsed w-[80px]' : 'w-[260px]'} 
                    transition-all duration-300
                    fixed lg:relative
                    h-full
                    z-50
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `brand flex items-center ${isSidebarCollapsed ? 'justify-center p-4' : 'justify-between p-5'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "brand-logo flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$SquaresFour$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SquaresFour"], {
                                            weight: "bold"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 62,
                                            columnNumber: 67
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 62,
                                        columnNumber: 25
                                    }, this),
                                    !isSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "animate-fadeIn",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontWeight: 700,
                                                    color: 'white',
                                                    fontSize: '15px',
                                                    letterSpacing: '-0.02em'
                                                },
                                                children: isSuperAdmin ? 'Antigravity DB' : currentTenant?.branding?.app_title || 'Maturity360'
                                            }, void 0, false, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 65,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 10,
                                                    opacity: 0.5,
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                },
                                                id: "tenant-label",
                                                children: isSuperAdmin ? 'Global View' : currentTenant?.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 68,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 64,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 61,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: closeMobileMenu,
                                        className: "text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 lg:hidden",
                                        title: "Cerrar Menú",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$X$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"], {
                                            size: 18,
                                            weight: "bold"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 80,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 75,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: toggleSidebar,
                                        className: `text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 hidden lg:block ${isSidebarCollapsed ? 'hidden' : ''}`,
                                        title: "Contraer Menú",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CaretLeft$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CaretLeft"], {
                                            size: 16,
                                            weight: "bold"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 87,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 82,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 74,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 60,
                        columnNumber: 17
                    }, this),
                    isSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden lg:flex justify-center p-2 border-b border-white/5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: toggleSidebar,
                            className: "text-white/40 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10",
                            title: "Expandir Menú",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CaretRight$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CaretRight"], {
                                size: 20,
                                weight: "bold"
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 99,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 94,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 93,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "nav",
                        id: "nav-menu",
                        children: isSuperAdmin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "nav-header",
                                    children: t('nav_platform')
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 107,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Planet$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Planet"],
                                    label: "Global Dashboard",
                                    path: "/dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 108,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Buildings$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buildings"],
                                    label: "Tenants",
                                    path: "/dashboard/tenants"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 109,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$UsersThree$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UsersThree"],
                                    label: "Users & Permissions",
                                    path: "/dashboard/admin/users"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 110,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Globe$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Globe"],
                                    label: "Platform Params",
                                    path: "/dashboard/platform"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 111,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ShieldCheck$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShieldCheck"],
                                    label: "Audit Global",
                                    path: "/dashboard/audit"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 112,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `nav-header ${isSidebarCollapsed ? 'text-center opacity-30 text-[9px]' : ''}`,
                                    children: isSidebarCollapsed ? '•••' : t('nav_operation')
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 116,
                                    columnNumber: 29
                                }, this),
                                (currentTenant?.features?.includes('DASHBOARD') || !currentTenant) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$SquaresFour$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SquaresFour"],
                                    label: t('nav_dashboard'),
                                    path: "/dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 121,
                                    columnNumber: 33
                                }, this),
                                currentTenant?.features?.includes('CHAT') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ChatCircleDots$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatCircleDots"],
                                    label: t('nav_chat'),
                                    path: "/dashboard/chat",
                                    badge: unreadChatCount
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 125,
                                    columnNumber: 33
                                }, this),
                                currentTenant?.features?.includes('REPOSITORY') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Files$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Files"],
                                    label: t('nav_repository'),
                                    path: "/dashboard/repository"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 128,
                                    columnNumber: 33
                                }, this),
                                currentTenant?.features?.includes('WORKFLOWS') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Kanban$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Kanban"],
                                    label: t('nav_workflows'),
                                    path: "/dashboard/workflows"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 131,
                                    columnNumber: 33
                                }, this),
                                currentTenant?.features?.includes('ANALYTICS') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ChartPieSlice$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChartPieSlice"],
                                    label: t('nav_analytics'),
                                    path: "/dashboard/analytics"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 134,
                                    columnNumber: 33
                                }, this),
                                currentTenant?.features?.includes('SURVEYS') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ClipboardText$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClipboardText"],
                                    label: t('nav_surveys'),
                                    path: "/dashboard/surveys"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 137,
                                    columnNumber: 33
                                }, this),
                                currentUser.level <= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "nav-header",
                                            children: currentUser.level === 1 ? t('nav_governance') : t('nav_management')
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 142,
                                            columnNumber: 37
                                        }, this),
                                        currentUser.level === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Gear$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Gear"],
                                                    label: t('nav_admin'),
                                                    path: "/dashboard/admin"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Sidebar.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$TreeStructure$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TreeStructure"],
                                                    label: t('nav_units'),
                                                    path: "/dashboard/admin/units"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Sidebar.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ShieldCheck$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShieldCheck"],
                                                    label: t('nav_roles'),
                                                    path: "/dashboard/admin/roles"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Sidebar.tsx",
                                                    lineNumber: 147,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$UsersThree$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UsersThree"],
                                                    label: t('nav_users'),
                                                    path: "/dashboard/admin/users"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Sidebar.tsx",
                                                    lineNumber: 148,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Megaphone$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Megaphone"],
                                                    label: t('nav_comms'),
                                                    path: "/dashboard/admin/communications"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Sidebar.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$GitPullRequest$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GitPullRequest"],
                                                    label: "Configuración Técnica",
                                                    path: "/dashboard/admin/settings"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Sidebar.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CloudArrowUp$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CloudArrowUp"],
                                                    label: "Almacenamiento",
                                                    path: "/dashboard/admin/storage"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Sidebar.tsx",
                                                    lineNumber: 151,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ChartPieSlice$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChartPieSlice"],
                                                    label: "Dashboard Storage",
                                                    path: "/dashboard/admin/storage-dashboard"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Sidebar.tsx",
                                                    lineNumber: 152,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$UsersThree$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UsersThree"],
                                            label: t('nav_unit'),
                                            path: "/dashboard/unit"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 155,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 104,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `user-profile ${isSidebarCollapsed ? 'justify-center p-3' : ''}`,
                        onClick: ()=>handleNavigation('/dashboard/profile'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "avatar",
                                id: "u-avatar",
                                children: currentUser.initials
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 164,
                                columnNumber: 21
                            }, this),
                            !isSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    overflow: 'hidden'
                                },
                                className: "animate-fadeIn",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        id: "u-name",
                                        style: {
                                            fontWeight: 600,
                                            color: 'white'
                                        },
                                        children: currentUser.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 167,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        id: "u-role",
                                        style: {
                                            fontSize: 11,
                                            opacity: 0.6
                                        },
                                        children: currentUser.role
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 168,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 166,
                                columnNumber: 25
                            }, this),
                            !isSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-ghost",
                                style: {
                                    color: 'white',
                                    padding: 4
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Gear$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Gear"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 173,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 172,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 163,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 48,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
}
_s(Sidebar, "niFzGemkQyCodLYBcErwHYe/oko=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Topbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Topbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ChatCircleDots$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/ChatCircleDots.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Moon$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Moon.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$SignOut$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/SignOut.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$List$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/List.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Topbar() {
    _s();
    const { currentUser, isSuperAdmin, logout, toggleMobileMenu } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const getTitle = ()=>{
        if (pathname === '/dashboard') return isSuperAdmin ? 'GLOBAL DASHBOARD' : 'DASHBOARD';
        if (pathname.includes('/analytics')) return 'ANALÍTICA';
        if (pathname.includes('/repository')) return 'REPOSITORIO';
        if (pathname.includes('/chat')) return 'MENSAJES';
        if (pathname.includes('/cases')) return 'TRÁMITES';
        if (pathname.includes('/workflows')) return 'FLUJOS';
        if (pathname.includes('/surveys')) return 'ENCUESTAS';
        if (pathname.includes('/admin')) return 'ADMINISTRACIÓN';
        if (pathname.includes('/profile')) return 'MI PERFIL';
        return 'DASHBOARD';
    };
    const toggleDark = ()=>{
        document.body.classList.toggle('dark');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "topbar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn btn-ghost lg:hidden p-2",
                        onClick: toggleMobileMenu,
                        "aria-label": "Abrir menú",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$List$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"], {
                            size: 24,
                            weight: "bold"
                        }, void 0, false, {
                            fileName: "[project]/components/Topbar.tsx",
                            lineNumber: 36,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 31,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        id: "page-title",
                        className: "text-base sm:text-lg font-semibold truncate",
                        children: getTitle()
                    }, void 0, false, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 38,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Topbar.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 sm:gap-4",
                children: [
                    isSuperAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "badge bg-super hidden sm:inline-flex",
                        children: "SUPER ADMIN"
                    }, void 0, false, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 41,
                        columnNumber: 34
                    }, this),
                    !isSuperAdmin && currentUser?.level === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "badge bg-warning hidden sm:inline-flex",
                        children: "ADMIN"
                    }, void 0, false, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 42,
                        columnNumber: 63
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn btn-ghost p-2",
                        onClick: ()=>router.push('/dashboard/chat'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ChatCircleDots$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatCircleDots"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/components/Topbar.tsx",
                                lineNumber: 45,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "nav-badge",
                                style: {
                                    top: 8,
                                    right: 6,
                                    width: 8,
                                    height: 8,
                                    padding: 0,
                                    display: 'block'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/Topbar.tsx",
                                lineNumber: 46,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 44,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn btn-ghost p-2 hidden sm:flex",
                        onClick: toggleDark,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Moon$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Moon"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/components/Topbar.tsx",
                            lineNumber: 50,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 49,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn btn-ghost p-2",
                        onClick: logout,
                        title: "Salir",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$SignOut$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SignOut"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/components/Topbar.tsx",
                            lineNumber: 54,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Topbar.tsx",
                        lineNumber: 53,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Topbar.tsx",
                lineNumber: 40,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Topbar.tsx",
        lineNumber: 29,
        columnNumber: 9
    }, this);
}
_s(Topbar, "klWHJLLDSktpKJhXhfY3dcphAIk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Topbar;
var _c;
__turbopack_context__.k.register(_c, "Topbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/SlideOver.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SlideOver
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UIContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$X$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/X.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$PaperPlaneRight$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/PaperPlaneRight.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function SlideOver() {
    _s();
    const { isSlideOpen, slideType, slideData, closeSlide, openViewer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"])();
    const { currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('detail');
    const [chatMsgs, setChatMsgs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [chatInput, setChatInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [forceUpdate, setForceUpdate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Reset tab when opening
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SlideOver.useEffect": ()=>{
            if (isSlideOpen) {
                setActiveTab('detail');
                if (slideData && slideData.id) {
                    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].contextChats[slideData.id]) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].contextChats[slideData.id] = [
                            {
                                text: `Sistema: Contexto ${slideType} creado`,
                                type: 'system'
                            }
                        ];
                    }
                    setChatMsgs(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].contextChats[slideData.id]);
                }
            }
        }
    }["SlideOver.useEffect"], [
        isSlideOpen,
        slideData,
        slideType
    ]);
    const sendContextMessage = ()=>{
        if (!chatInput.trim() || !slideData) return;
        const newMsg = {
            text: chatInput,
            type: 'self'
        }; // In real app, user ID
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].contextChats[slideData.id].push(newMsg);
        setChatMsgs([
            ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].contextChats[slideData.id]
        ]);
        setChatInput('');
    };
    const handleKey = (e)=>{
        if (e.key === 'Enter') sendContextMessage();
    };
    const renderDetail = ()=>{
        if (!slideData) return null;
        const { id, title } = slideData;
        if (slideType === 'doc') {
            const comments = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].publicComments.filter((c)=>c.docId === id) || [];
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/SlideOver.tsx",
                        lineNumber: 52,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn btn-primary",
                        style: {
                            width: '100%',
                            margin: '10px 0'
                        },
                        onClick: ()=>openViewer(title),
                        children: "Visualizar"
                    }, void 0, false, {
                        fileName: "[project]/components/SlideOver.tsx",
                        lineNumber: 53,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                        style: {
                            margin: '20px 0',
                            border: 0,
                            borderTop: '1px solid var(--border)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/SlideOver.tsx",
                        lineNumber: 60,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        children: "Comentarios"
                    }, void 0, false, {
                        fileName: "[project]/components/SlideOver.tsx",
                        lineNumber: 61,
                        columnNumber: 21
                    }, this),
                    comments.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "comment-item",
                            style: {
                                marginBottom: 10
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: c.authorName
                                }, void 0, false, {
                                    fileName: "[project]/components/SlideOver.tsx",
                                    lineNumber: 64,
                                    columnNumber: 29
                                }, this),
                                ": ",
                                c.content
                            ]
                        }, i, true, {
                            fileName: "[project]/components/SlideOver.tsx",
                            lineNumber: 63,
                            columnNumber: 25
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/SlideOver.tsx",
                lineNumber: 51,
                columnNumber: 17
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: title
                }, void 0, false, {
                    fileName: "[project]/components/SlideOver.tsx",
                    lineNumber: 73,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Detalle del contenido..."
                }, void 0, false, {
                    fileName: "[project]/components/SlideOver.tsx",
                    lineNumber: 74,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SlideOver.tsx",
            lineNumber: 72,
            columnNumber: 13
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "slide-overlay",
                style: {
                    display: isSlideOpen ? 'block' : 'none'
                },
                onClick: closeSlide
            }, void 0, false, {
                fileName: "[project]/components/SlideOver.tsx",
                lineNumber: 81,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `slide-over ${isSlideOpen ? 'open' : ''}`,
                id: "slide-panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-head",
                        style: {
                            background: 'white'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                id: "slide-title",
                                style: {
                                    fontSize: 16
                                },
                                children: slideType === 'doc' ? 'Documento' : 'Trámite'
                            }, void 0, false, {
                                fileName: "[project]/components/SlideOver.tsx",
                                lineNumber: 89,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-ghost",
                                onClick: closeSlide,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$X$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/components/SlideOver.tsx",
                                    lineNumber: 93,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/SlideOver.tsx",
                                lineNumber: 92,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SlideOver.tsx",
                        lineNumber: 88,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "tabs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `tab ${activeTab === 'detail' ? 'active' : ''}`,
                                onClick: ()=>setActiveTab('detail'),
                                children: "Info & Social"
                            }, void 0, false, {
                                fileName: "[project]/components/SlideOver.tsx",
                                lineNumber: 98,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `tab ${activeTab === 'chat' ? 'active' : ''}`,
                                onClick: ()=>setActiveTab('chat'),
                                children: [
                                    "Chat Privado ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "badge bg-danger",
                                        style: {
                                            fontSize: 9
                                        },
                                        children: "Context"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SlideOver.tsx",
                                        lineNumber: 108,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SlideOver.tsx",
                                lineNumber: 104,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SlideOver.tsx",
                        lineNumber: 97,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "slide-content",
                        style: {
                            flex: 1,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "tab-pane",
                                style: {
                                    display: activeTab === 'detail' ? 'block' : 'none',
                                    flex: 1,
                                    padding: 24,
                                    overflowY: 'auto'
                                },
                                children: renderDetail()
                            }, void 0, false, {
                                fileName: "[project]/components/SlideOver.tsx",
                                lineNumber: 114,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "chat-pane",
                                style: {
                                    display: activeTab === 'chat' ? 'flex' : 'none',
                                    flexDirection: 'column',
                                    height: '100%',
                                    padding: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "messages-area",
                                        style: {
                                            flex: 1,
                                            padding: 20
                                        },
                                        children: chatMsgs.map((m, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `message ${m.type === 'system' ? 'msg-system' : 'msg-self'}`,
                                                children: m.text
                                            }, i, false, {
                                                fileName: "[project]/components/SlideOver.tsx",
                                                lineNumber: 121,
                                                columnNumber: 33
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/SlideOver.tsx",
                                        lineNumber: 119,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "chat-input",
                                        style: {
                                            padding: 12,
                                            borderTop: '1px solid var(--border)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: chatInput,
                                                onChange: (e)=>setChatInput(e.target.value),
                                                placeholder: "Escribe un mensaje...",
                                                onKeyPress: handleKey
                                            }, void 0, false, {
                                                fileName: "[project]/components/SlideOver.tsx",
                                                lineNumber: 127,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btn-primary btn-icon",
                                                onClick: sendContextMessage,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$PaperPlaneRight$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PaperPlaneRight"], {}, void 0, false, {
                                                    fileName: "[project]/components/SlideOver.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/SlideOver.tsx",
                                                lineNumber: 134,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SlideOver.tsx",
                                        lineNumber: 126,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SlideOver.tsx",
                                lineNumber: 118,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SlideOver.tsx",
                        lineNumber: 112,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SlideOver.tsx",
                lineNumber: 87,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
}
_s(SlideOver, "QPDbh1/FG3a0ZIemUFSXZEx3zW4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c = SlideOver;
var _c;
__turbopack_context__.k.register(_c, "SlideOver");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/DocViewer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DocViewer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UIContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function DocViewer() {
    _s();
    const { isViewerOpen, viewerTitle, closeViewer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "doc-viewer-overlay",
        style: {
            display: isViewerOpen ? 'flex' : 'none'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "doc-viewer-window",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "doc-viewer-header",
                    style: {
                        background: '#1e293b',
                        color: 'white',
                        height: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 20px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontWeight: 500
                            },
                            children: viewerTitle || 'Documento.pdf'
                        }, void 0, false, {
                            fileName: "[project]/components/DocViewer.tsx",
                            lineNumber: 14,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-primary",
                            onClick: closeViewer,
                            children: "Cerrar"
                        }, void 0, false, {
                            fileName: "[project]/components/DocViewer.tsx",
                            lineNumber: 15,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DocViewer.tsx",
                    lineNumber: 13,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "doc-viewer-body",
                    style: {
                        background: '#64748b',
                        flex: 1,
                        overflow: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: 40
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sim-pdf-page",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: viewerTitle
                            }, void 0, false, {
                                fileName: "[project]/components/DocViewer.tsx",
                                lineNumber: 19,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {}, void 0, false, {
                                fileName: "[project]/components/DocViewer.tsx",
                                lineNumber: 20,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Vista previa simulada..."
                            }, void 0, false, {
                                fileName: "[project]/components/DocViewer.tsx",
                                lineNumber: 21,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4",
                                children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                            }, void 0, false, {
                                fileName: "[project]/components/DocViewer.tsx",
                                lineNumber: 22,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DocViewer.tsx",
                        lineNumber: 18,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/DocViewer.tsx",
                    lineNumber: 17,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/DocViewer.tsx",
            lineNumber: 12,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/DocViewer.tsx",
        lineNumber: 8,
        columnNumber: 9
    }, this);
}
_s(DocViewer, "7lG/ZXgYyqBR/WwcHL094iQpkkI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUI"]
    ];
});
_c = DocViewer;
var _c;
__turbopack_context__.k.register(_c, "DocViewer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/onboarding/UserTour.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UserTour
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$X$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/X.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CaretRight$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/CaretRight.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Check$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Check.es.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function UserTour() {
    _s();
    const { currentUser, isSuperAdmin, currentTenant } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [targetRect, setTargetRect] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Initial Check
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserTour.useEffect": ()=>{
            if (!currentUser) return;
            const tourKey = `tour_completed_${currentUser.id}_v3`; // v3 versioning
            const hasCompleted = localStorage.getItem(tourKey);
            if (!hasCompleted) {
                // Small delay to ensure UI renders
                const timer = setTimeout({
                    "UserTour.useEffect.timer": ()=>{
                        setIsVisible(true);
                    }
                }["UserTour.useEffect.timer"], 1000);
                return ({
                    "UserTour.useEffect": ()=>clearTimeout(timer)
                })["UserTour.useEffect"];
            }
        }
    }["UserTour.useEffect"], [
        currentUser
    ]);
    // Define Steps based on Role
    const steps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UserTour.useMemo[steps]": ()=>{
            const commonSteps = [
                {
                    id: 'welcome',
                    title: `Bienvenido a ${currentTenant?.name || 'la Plataforma'}`,
                    content: 'Te damos la bienvenida a tu nuevo espacio de trabajo. Acompáñanos en un breve recorrido para conocer las herramientas principales.',
                    placement: 'center'
                }
            ];
            let roleSteps = [];
            if (isSuperAdmin) {
                roleSteps = [
                    {
                        id: 'nav-platform',
                        title: 'Gestión Global',
                        content: 'Aquí tienes acceso total a todos los Tenants, Usuarios y Configuraciones de la plataforma.',
                        targetId: 'nav-item--dashboard',
                        placement: 'right'
                    },
                    {
                        id: 'nav-tenants',
                        title: 'Tenants',
                        content: 'Administra las organizaciones y sus suscripciones desde aquí.',
                        targetId: 'nav-item--dashboard-tenants',
                        placement: 'right'
                    },
                    {
                        id: 'nav-users-global',
                        title: 'Usuarios y Permisos',
                        content: 'Control de acceso y roles a nivel global.',
                        targetId: 'nav-item--dashboard-admin-users',
                        placement: 'right'
                    }
                ];
            } else {
                // --- Tenant User (Admin or Regular) ---
                // 1. Dashboard (Always available if enabled or default)
                if (currentTenant?.features?.includes('DASHBOARD')) {
                    roleSteps.push({
                        id: 'nav-dashboard',
                        title: 'Tu Panel de Control',
                        content: 'Visualiza indicadores clave y el estado general de tu organización.',
                        targetId: 'nav-item--dashboard',
                        placement: 'right'
                    });
                }
                // 2. Chat
                if (currentTenant?.features?.includes('CHAT')) {
                    roleSteps.push({
                        id: 'nav-chat',
                        title: 'Mensajería y Colaboración',
                        content: 'Comunícate en tiempo real con tu equipo y crea grupos de trabajo.',
                        targetId: 'nav-item--dashboard-chat',
                        placement: 'right'
                    });
                }
                // 3. Repository
                if (currentTenant?.features?.includes('REPOSITORY')) {
                    roleSteps.push({
                        id: 'nav-repo',
                        title: 'Repositorio Documental',
                        content: 'Centraliza y gestiona todos los documentos importantes de tu organización.',
                        targetId: 'nav-item--dashboard-repository',
                        placement: 'right'
                    });
                }
                // 4. Workflows / Projects
                if (currentTenant?.features?.includes('WORKFLOWS')) {
                    roleSteps.push({
                        id: 'nav-workflows',
                        title: 'Proyectos y Flujos',
                        content: 'Organiza tus proyectos, tareas y entregables en un solo lugar.',
                        targetId: 'nav-item--dashboard-workflows',
                        placement: 'right'
                    });
                }
                // 5. Analytics
                if (currentTenant?.features?.includes('ANALYTICS')) {
                    roleSteps.push({
                        id: 'nav-analytics',
                        title: 'Analítica Avanzada',
                        content: 'Explora datos y reportes detallados para la toma de decisiones.',
                        targetId: 'nav-item--dashboard-analytics',
                        placement: 'right'
                    });
                }
                // 6. Surveys
                if (currentTenant?.features?.includes('SURVEYS')) {
                    roleSteps.push({
                        id: 'nav-surveys',
                        title: 'Encuestas y Evaluaciones',
                        content: 'Gestiona clima laboral, evaluaciones de madurez y formularios.',
                        targetId: 'nav-item--dashboard-surveys',
                        placement: 'right'
                    });
                }
                // 7. Admin / Manager Steps
                if (currentUser?.level !== undefined && currentUser.level <= 2) {
                    roleSteps.push({
                        id: 'nav-admin',
                        title: 'Administración',
                        content: 'Configura unidades, roles, usuarios y parámetros de tu Tenant.',
                        targetId: 'nav-item--dashboard-admin',
                        placement: 'right'
                    });
                }
                // 8. Department Management (Manager+)
                if (currentUser?.level !== undefined && currentUser.level <= 2) {
                    roleSteps.push({
                        id: 'nav-units',
                        title: 'Estructura Organizacional',
                        content: 'Define y gestiona las unidades y jerarquías de tu empresa.',
                        targetId: 'nav-item--dashboard-admin-units',
                        placement: 'right'
                    });
                }
            }
            const finalSteps = [
                ...commonSteps,
                ...roleSteps,
                {
                    id: 'profile',
                    title: 'Tu Perfil',
                    content: 'Accede a tus preferencias personales, cambio de contraseña y cierre de sesión.',
                    targetId: 'u-avatar',
                    placement: 'top' // Usually at bottom sidebar
                },
                {
                    id: 'finish',
                    title: '¡Todo listo!',
                    content: 'Ya estás preparado para comenzar. Si tienes dudas, busca el icono de ayuda.',
                    placement: 'center' // Use explicit center placement
                }
            ];
            return finalSteps;
        }
    }["UserTour.useMemo[steps]"], [
        currentUser,
        isSuperAdmin,
        currentTenant
    ]);
    // Update Rect on Step Change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserTour.useEffect": ()=>{
            if (!isVisible) return;
            const step = steps[currentStep];
            if (!step) return;
            if (step.targetId) {
                const el = document.getElementById(step.targetId);
                if (el) {
                    setTargetRect(el.getBoundingClientRect());
                    // Scroll into view if needed
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                } else {
                    // Determine fallback behavior if element not found. 
                    // For now, let's just default to null rect -> render centered as fallback?
                    // Or try finding it again in a loop?
                    // Actually, if we can't find it, maybe skip?
                    console.warn(`Tour target ${step.targetId} not found, centering.`);
                    setTargetRect(null);
                }
            } else {
                setTargetRect(null);
            }
        }
    }["UserTour.useEffect"], [
        currentStep,
        isVisible,
        steps
    ]);
    // Handle Resize
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserTour.useEffect": ()=>{
            const handleResize = {
                "UserTour.useEffect.handleResize": ()=>{
                    const step = steps[currentStep];
                    if (step?.targetId) {
                        const el = document.getElementById(step.targetId);
                        if (el) setTargetRect(el.getBoundingClientRect());
                    }
                }
            }["UserTour.useEffect.handleResize"];
            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleResize, true);
            return ({
                "UserTour.useEffect": ()=>{
                    window.removeEventListener('resize', handleResize);
                    window.removeEventListener('scroll', handleResize, true);
                }
            })["UserTour.useEffect"];
        }
    }["UserTour.useEffect"], [
        currentStep,
        steps
    ]);
    const handleNext = ()=>{
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev)=>prev + 1);
        } else {
            finishTour();
        }
    };
    const handlePrev = ()=>{
        if (currentStep > 0) {
            setCurrentStep((prev)=>prev - 1);
        }
    };
    const finishTour = ()=>{
        if (currentUser) {
            localStorage.setItem(`tour_completed_${currentUser.id}_v3`, 'true');
        }
        setIsVisible(false);
    };
    if (!isVisible) return null;
    const step = steps[currentStep];
    if (!step) return null;
    // Helper for Popover Position
    const getPopoverStyle = ()=>{
        if (!targetRect || step.placement === 'center' || !step.targetId) {
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '450px',
                width: '90%'
            };
        }
        const gap = 16;
        const styles = {
            position: 'absolute',
            maxWidth: '350px'
        };
        // Simple positioning logic
        if (step.placement === 'right') {
            styles.top = targetRect.top + targetRect.height / 2 - 100; // Offset up slightly for balance
            styles.left = targetRect.right + gap;
        } else if (step.placement === 'bottom') {
            styles.top = targetRect.bottom + gap;
            styles.left = targetRect.left + targetRect.width / 2 - 175;
        } else if (step.placement === 'top') {
            styles.bottom = window.innerHeight - targetRect.top + gap;
            styles.left = targetRect.left;
        }
        // Boundary checks would be good here but keeping simple
        return styles;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] overflow-hidden",
        children: [
            targetRect && step.placement !== 'center' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bg-transparent transition-all duration-500 ease-in-out box-content border-4 border-blue-500/50 rounded-lg",
                style: {
                    top: targetRect.top - 4,
                    left: targetRect.left - 4,
                    width: targetRect.width,
                    height: targetRect.height,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 rounded-lg animate-ping bg-blue-500/30"
                }, void 0, false, {
                    fileName: "[project]/components/onboarding/UserTour.tsx",
                    lineNumber: 303,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/onboarding/UserTour.tsx",
                lineNumber: 292,
                columnNumber: 17
            }, this) : // Full Backdrop for Center Modal
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-500"
            }, void 0, false, {
                fileName: "[project]/components/onboarding/UserTour.tsx",
                lineNumber: 307,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute z-[10000] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-out border border-white/20",
                style: getPopoverStyle(),
                children: [
                    step.placement === 'center' && currentStep === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-32 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center relative overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
                            }, void 0, false, {
                                fileName: "[project]/components/onboarding/UserTour.tsx",
                                lineNumber: 318,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-6xl text-white opacity-20 absolute -bottom-4 -right-4 rotate-12",
                                children: "👋"
                            }, void 0, false, {
                                fileName: "[project]/components/onboarding/UserTour.tsx",
                                lineNumber: 319,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/onboarding/UserTour.tsx",
                        lineNumber: 317,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-start mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-bold text-slate-800 leading-tight",
                                        children: [
                                            currentStep + 1,
                                            ". ",
                                            step.title
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/onboarding/UserTour.tsx",
                                        lineNumber: 325,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: finishTour,
                                        className: "text-slate-400 hover:text-slate-600 transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$X$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/components/onboarding/UserTour.tsx",
                                            lineNumber: 329,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/onboarding/UserTour.tsx",
                                        lineNumber: 328,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/onboarding/UserTour.tsx",
                                lineNumber: 324,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-600 mb-8 leading-relaxed text-sm",
                                children: step.content
                            }, void 0, false, {
                                fileName: "[project]/components/onboarding/UserTour.tsx",
                                lineNumber: 333,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center pt-4 border-t border-slate-100 mt-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-1",
                                        children: steps.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-200'}`
                                            }, i, false, {
                                                fileName: "[project]/components/onboarding/UserTour.tsx",
                                                lineNumber: 340,
                                                columnNumber: 33
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/onboarding/UserTour.tsx",
                                        lineNumber: 338,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            currentStep > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handlePrev,
                                                className: "px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors",
                                                children: "Atrás"
                                            }, void 0, false, {
                                                fileName: "[project]/components/onboarding/UserTour.tsx",
                                                lineNumber: 346,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleNext,
                                                className: "px-5 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2",
                                                children: [
                                                    currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente',
                                                    currentStep === steps.length - 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Check$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Check"], {
                                                        weight: "bold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/onboarding/UserTour.tsx",
                                                        lineNumber: 358,
                                                        columnNumber: 69
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CaretRight$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CaretRight"], {
                                                        weight: "bold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/onboarding/UserTour.tsx",
                                                        lineNumber: 358,
                                                        columnNumber: 95
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/onboarding/UserTour.tsx",
                                                lineNumber: 353,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/onboarding/UserTour.tsx",
                                        lineNumber: 344,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/onboarding/UserTour.tsx",
                                lineNumber: 337,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/onboarding/UserTour.tsx",
                        lineNumber: 323,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/onboarding/UserTour.tsx",
                lineNumber: 311,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/onboarding/UserTour.tsx",
        lineNumber: 288,
        columnNumber: 9
    }, this), document.body);
}
_s(UserTour, "a0nPL7485hKn1Z1/ir5mHFaL/Ow=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c = UserTour;
var _c;
__turbopack_context__.k.register(_c, "UserTour");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Topbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Topbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlideOver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SlideOver.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DocViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DocViewer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Warning$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Warning.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$onboarding$2f$UserTour$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/onboarding/UserTour.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function DashboardLayout({ children }) {
    _s();
    const { currentUser, originalSession, stopImpersonation, updateUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardLayout.useEffect": ()=>{
            // Basic protection - if not logged in, go to home
            // In a real app we'd wait for loading state, but here currentUser is sync after login
            // However, on refresh, currentUser is wiped because it's in-memory.
            // For this prototype, we'll redirect if null.
            if (!currentUser) router.push('/');
        }
    }["DashboardLayout.useEffect"], [
        currentUser,
        router
    ]);
    if (!currentUser) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-screen overflow-hidden",
        children: [
            originalSession && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-amber-400 text-amber-900 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-sm z-[100]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Warning$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Warning"], {
                                weight: "fill",
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/layout.tsx",
                                lineNumber: 35,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "uppercase tracking-wide",
                                children: [
                                    "Support Mode: Impersonating ",
                                    currentUser.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/layout.tsx",
                                lineNumber: 36,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/layout.tsx",
                        lineNumber: 34,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: stopImpersonation,
                        className: "bg-white/20 hover:bg-white/40 px-3 py-1 rounded text-[10px] uppercase font-bold transition-colors flex items-center gap-1",
                        children: "Exit Support"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/layout.tsx",
                        lineNumber: 38,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/layout.tsx",
                lineNumber: 33,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/dashboard/layout.tsx",
                        lineNumber: 44,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 flex flex-col overflow-hidden relative w-full lg:w-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Topbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/dashboard/layout.tsx",
                                lineNumber: 46,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "content",
                                children: children
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/layout.tsx",
                                lineNumber: 47,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/layout.tsx",
                        lineNumber: 45,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SlideOver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/dashboard/layout.tsx",
                        lineNumber: 51,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DocViewer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/dashboard/layout.tsx",
                        lineNumber: 52,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/layout.tsx",
                lineNumber: 43,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$onboarding$2f$UserTour$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/dashboard/layout.tsx",
                lineNumber: 54,
                columnNumber: 13
            }, this),
            currentUser.mustChangePassword && !originalSession && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-slate-900/90 z-[200] flex items-center justify-center p-4 backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Warning$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Warning"], {
                                size: 32,
                                weight: "fill"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/layout.tsx",
                                lineNumber: 61,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/layout.tsx",
                            lineNumber: 60,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-slate-800 mb-2",
                            children: "Security Update Required"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/layout.tsx",
                            lineNumber: 63,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slate-600 mb-6",
                            children: "For your security, you must update your password before proceeding."
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/layout.tsx",
                            lineNumber: 64,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: (e)=>{
                                e.preventDefault();
                                updateUser({
                                    mustChangePassword: false
                                });
                                alert('Password updated successfully.');
                            },
                            className: "space-y-4 text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-slate-500 mb-1",
                                            children: "New Password"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/layout.tsx",
                                            lineNumber: 72,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "password",
                                            required: true,
                                            className: "w-full px-4 py-2 border rounded-lg",
                                            placeholder: "••••••••"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/layout.tsx",
                                            lineNumber: 73,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/layout.tsx",
                                    lineNumber: 71,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-slate-500 mb-1",
                                            children: "Confirm Password"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/layout.tsx",
                                            lineNumber: 76,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "password",
                                            required: true,
                                            className: "w-full px-4 py-2 border rounded-lg",
                                            placeholder: "••••••••"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/layout.tsx",
                                            lineNumber: 77,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/layout.tsx",
                                    lineNumber: 75,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-primary w-full justify-center",
                                    children: "Update Password"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/layout.tsx",
                                    lineNumber: 79,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/layout.tsx",
                            lineNumber: 66,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/layout.tsx",
                    lineNumber: 59,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/layout.tsx",
                lineNumber: 58,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/layout.tsx",
        lineNumber: 31,
        columnNumber: 9
    }, this);
}
_s(DashboardLayout, "BrVEXsPenNun6mYBQzwwLs6is8A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DashboardLayout;
var _c;
__turbopack_context__.k.register(_c, "DashboardLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_2b327f00._.js.map