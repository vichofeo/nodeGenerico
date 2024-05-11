const AGRUPADO = {
    //all : ['institucion', 'eess', 'propietario', 'responsablen', 'servicios_basicos', 'atencion', 'superficie', 'estructura', 'infraestructuran', 'mobiliarion', 'equipamienton', 'personaln'],
    all : ['institucion', 'eess', 'propietario', 'responsablen', 'servicios_basicos', 'r3areasn', 'superficie', 'r3estucturan', 'infraestructuran', 'r3mobiliarion', 'r3equipamienton', 'personaln'],
    eesseg: ['eess_corto', 'propietario', 'responsable'],
    acre_hab: ['evaluacionn','acreditacionn','habilitacionn','repo_acrehab'],

    //componentes equivalente a db
    acrehab: ['evaluacionn','repo_pac','acreditacionn','habilitacionn','repo_acrehab'],
    acrehab_icons: ['mdi-altimeter','mdi-file-check','mdi-grease-pencil','mdi-key-change','mdi-clipboard-text'],
    report:['eess', 'servbas', 'tipoatcn', 'equipamiento', 'personal', 'acrehab'],
    report_icons:['mdi-hospital-building','mdi-ambulance', 'mdi-snowman', 'mdi-cart-plus', 'mdi-human-male-female', 'mdi-certificate']
}

module.exports = {
    AGRUPADO,
}