//[label,editable,requerido,<T:texto, C:combo, R:Radio, H:checkBox, F: fecha>]
const PARAMETROS = {
    eess: {
        table: 'r_institucion_salud',
        alias: 'Ubicacion',
        cardinalidad: "1",
        campos: {
            codigo: ['Codigo Institucion', false, true, 'T'],
            ente_gestor_id: ['Ente Gestor', false, true, 'T'],
            tipo_red_id: ['Red', true, false, 'C'],
            clase: ['Clase Institucion', true, true, 'C'],
            nivel_atencion: ['Nivel de Atencion', true, true, 'C'],
            subsector: ['Sub Sector', false, true, 'C'],
            urbano_rural: ['Area', true, true, 'C'],
            nit: ['NIT', true, false, 'T'],
            no_ra: ['No. Resolucion Administrativa', true, false, 'T'],
            accesibilidad_eess: ['Accesibilidad', true, false, 'C'],
            carretera_eess: ['Via de Acceso', true, false, 'C'],
        },
        key: ['institucion_id'],
        update: [],
        referer: [
            { ref: 'institucion', camporef: 'institucion_id', camporefForeign: 'ente_gestor_id', campos: ['nombre_institucion'], alias: 'ente_gestor', condicion: { institucion_id: 'xx' } },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'clase', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'CLASE' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'nivel_atencion', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'NIVELATENCION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'subsector', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'SUBSECTOR' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'urbano_rural', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'AREA' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'accesibilidad_eess', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: '06ACCESIBILIDAD' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'carretera_eess', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: '06CARRETERA' },
        ],
    },
    institucion: {
        table: 'r_institucion',
        alias: 'Identificacion',
        cardinalidad: "1",
        campos: {
            nombre_institucion: ['Nombre de la institucion', true, true, 'T'],
            nombre_corto: ['Nombre Corto o Abrev.', true, true, 'T'],
            fecha_creacion: ['Fecha de Creacion', true, true, 'F'],
            fecha_actividades: ['Fecha inicio Actidades', true, true, 'F'],
            direccion_web: ['Direccion_web', true, true, 'T'],
            correo_electronico: ['Correo electronico', true, true, 'T'],
            telefono: ['Telefono', true, true, 'T'],
            fax: ['Fax', true, true, 'T'],
            telefono_emergencia: ['Telefono emergencias', true, true, 'T'],
        },
        key: ['institucion_id'],
        update: [],
        referer: [],
    },
    propietario: {
        table: 'r_institucion_salud',
        alias: 'propietario',
        cardinalidad: "1",
        campos: {
            pro_nit: ['NIT', true, false, 'T'],
            pro_razon_social: ['Razon Social', true, true, 'T'],
            pro_direccion: ['Direccion Completa', true, true, 'T'],
            pro_telefono: ['Telefono', true, true, 'T'],
            pro_fax: ['Fax', true, false, 'T'],
            pro_pag_web: ['Pagina Web', true, false, 'T'],
            pro_correo_electronico: ['Correo Electronico', true, false, 'T'],

        },
        key: ['institucion_id'],
        update: [],
        referer: [],
    },
    responsablen: {
        table: 'au_persona au',
        alias: 'Responsables',
        cardinalidad: "n",
        campos: `au.dni_persona, au.tipo_dni, au.dni, au.dni_complemento,
        au.primer_apellido, au.segundo_apellido, au.casada_apellido, au.nombres,
        au.estado_civil, au.genero, au.nacionalidad, au.discapacidad,
        isr.profesion_ocupacion, isr.matricula_profesional
        `,

        camposView: [{ value: "dni_persona", text: "CI" }, 
            { value: "primer_apellido", text: "Apellido" }, { value: "nombres", text: "Nombres" },        
         { value: "desc_profesion_ocupacion", text: "Profesion/ocupacion" },
        { value: "desc_nacionalidad", text: "Nacionalidad" },
        { value: "matricula_profesional", text: "Matricula Profesional" }, 
        ],
        key: ['isr.institucion_id'],
        precondicion: ["au.dni_persona = isr.dni_persona", "isr.activo='Y'"],
        update: [],
        referer: [
            { ref: 'r_is_atributo as atr1', camporef: 'atr1.atributo_id', camporefForeign: 'au.estado_civil', alias: 'grupo_atributo', campos: 'atr1.atributo as desc_estado_civil', condicion: 'PERESTADOCIVIL' },
            { ref: 'r_is_atributo as atr2', camporef: 'atr2.atributo_id', camporefForeign: 'au.genero', alias: 'grupo_atributo', campos: 'atr2.atributo as desc_genero', condicion: 'PERGENERO' },
            { ref: 'r_is_atributo as atr3', camporef: 'atr3.atributo_id', camporefForeign: 'au.nacionalidad', alias: 'grupo_atributo', campos: 'atr3.atributo as desc_nacionalidad', condicion: 'PERNACIONALIDAD' },
            { ref: 'r_is_atributo as atr33', camporef: 'atr33.atributo_id', camporefForeign: 'au.discapacidad', alias: 'grupo_atributo', campos: 'atr33.atributo as desc_discapacidad', condicion: 'AFIRMACION' },

            { tabla: 'r_institucion_salud_responsable isr' },
            
            { ref: 'r_is_atributo as atr6', camporef: 'atr6.atributo_id', camporefForeign: 'isr.profesion_ocupacion', alias: 'grupo_atributo', campos: 'atr6.atributo as desc_profesion_ocupacion', condicion: 'PERGRUPOPROFESION' },
            

        ],
    },

    servicios_basicos: {
        table: 'r_institucion_salud',
        alias: 'Servicios Basicos',
        cardinalidad: "1",
        campos: {
            //servicios basicos
            cableado_red: ['Cableado de Red de Computadoras', true, true, 'C'],
            internet: ['Cuenta con Internet', true, true, 'C'],
            empresa_internet: ['Empresa que provee Internet', true, true, 'C'],
            financiamiento_internet: ['Financiamiento del Internet por', true, true, 'C'],
            tipo_internet: ['Tipo de Internet', true, true, 'C'],

            con_energia: ['Cuenta con Energia Electrica', true, true, 'C'],
            energia_electrica: ['Energia Electrica', true, true, 'C'],
            tipo_energia: ['Tipo de Energia', true, true, 'C'],
            sistema_iluminacion: ['Sistema de Iluminacion', true, true, 'C'],

            conexion_gas: ['Conexion a gas', true, true, 'C'],
            agua: ['Agua', true, true, 'C'],
            tratamiento_agua: ['Instalaciones para el tratamiento de Agua', true, true, 'C'],
            alcantarillado: ['Alcantarillado conectado a la Red', true, true, 'C'],
            del_excretas: ['Eliminacion de Excretas', true, true, 'C'],

            telefonia_fija: ['Telefonia Fija', true, true, 'C'],
            telefonia_movil: ['Telefonia Movil', true, true, 'C'],

            central_oxigeno: ['Central de Oxigeno', true, true, 'C'],
            gas_medicinal: ['Gases Medicinales', true, true, 'C'],
            filtro_aire: ['Filtro de Aire Estandar de Eficiencia(HEPA)', true, true, 'C'],
            climatizacion: ['Climatizacion', true, true, 'C'],

            taller_mantenimiento: ['Taller de manteniento', true, true, 'C'],
            taller_reparacion: ['Taller de Reparacion de Equipos Medicos', true, true, 'C'],
            deposito_combustible: ['Depositos de Combustible', true, true, 'C'],

            otras_instalaciones: ['Otras Instalaciones', true, true, 'T'],
        },
        key: ['institucion_id'],
        update: [],
        referer: [
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'cableado_red', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'internet', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'AFIRMACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'empresa_internet', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'INTERNETEMP' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'financiamiento_internet', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'FINANCIAMIENTO' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'tipo_internet', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'INTERNETTIPO' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'con_energia', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'AFIRMACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'energia_electrica', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'ENERGIA' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'tipo_energia', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'ENERGIATIPO' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'sistema_iluminacion', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'conexion_gas', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'agua', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'AGUA' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'tratamiento_agua', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'alcantarillado', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'AFIRMACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'del_excretas', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'DELEXCRETA' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'telefonia_fija', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'telefonia_movil', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'central_oxigeno', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'gas_medicinal', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'filtro_aire', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'climatizacion', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'taller_mantenimiento', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'taller_reparacion', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'deposito_combustible', campos: ['atributo_id', 'atributo'], alias: 'grupo_atributo', condicion: 'CALIFICACION' },
        ],
    },

    atencion: {
        table: 'r_institucion_salud',
        alias: 'Tipo Atencion',
        cardinalidad: "1",
        campos: {

            camilla_emergencia: ['Nro. de Camillas en Emergencia', true, true, 'T'],
            camas_obs_emergencia: ['Nro. de Camas Obs. Emergencia', true, true, 'T'],
            camas_obs_preparto: ['Nro. de Camas - Preparto', true, true, 'T'],
            camas_internacion: ['Nro. de Camas - Internacion', true, true, 'T'],
            camas_uti: ['Nro. de Camas - UTI', true, true, 'T'],
            camas_uti_neonatal: ['Nro. de Camas - UTI Neonatal', true, true, 'T'],
            camas_uci: ['Nro. de Camas - UCI', true, true, 'T'],
            camas_uci_neonatal: ['Nro. de Camas - Neonatal', true, true, 'T'],
            atencion_horario: ['Horario Atencion', true, true, 'C'],
            atencion_horas: ['Cantidad Horas de Atencion', true, true, 'C'],
        },
        key: ['institucion_id'],
        update: [],
        referer: [
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'atencion_horario', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'ATENCIONHORARIO' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'atencion_horas', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'ATENCIONHORAS' }
        ],
    },

    superficie: {
        table: 'r_institucion_salud',
        alias: 'Caracteristicas y Superficie',
        cardinalidad: "1",
        campos: {
            caracteristicas_terreno: ['Caracteristicas del Terreno', true, true, 'C'],
            superficie_construida: ['Superficie Construida', true, true, 'T'],
            superficie_circulacion: ['Superficie Circulacion', true, true, 'T'],
            superficie_total: ['Superficie Total del Terreno', true, true, 'T']
        },
        key: ['institucion_id'],
        update: [],
        referer: [{
            ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'caracteristicas_terreno', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'TERRENO',
        }],
    },

    estructura: {
        table: 'r_institucion_salud',
        alias: 'Estructura',
        cardinalidad: "1",
        campos: {
            estructura_estado: ['Estado Actual de Estructura', true, true, 'C'],
            estructura_base: ['Estructura Base', true, true, 'C'],
            estructura_techo: ['Techo', true, true, 'C'],
            estructura_piso: ['Piso', true, true, 'C'],
            estructura_tipo_pared: ['Tipo de Pared', true, true, 'T'],
            estructura_acabado_exterior: ['Acabado Exterior', true, true, 'C'],
            estructura_acabado_interior: ['Acabado Interior', true, true, 'C'],

        },
        key: ['institucion_id'],
        update: [],
        referer: [
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'estructura_estado', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'ESTRUCTURAESTADO' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'estructura_base', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'ESTRUCTURABASE' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'estructura_techo', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'ESTRUCTURATECHO' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'estructura_piso', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'ESTRUCTURAPISO' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'estructura_acabado_exterior', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'ESTRUCTURAACABADO' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'estructura_acabado_interior', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'ESTRUCTURAACABADO' },
        ],
    },

    infraestructuran: {
        table: 'r_institucion_salud_infraestructura',
        alias: 'Infraestructura',
        cardinalidad: "n",
        campos: "infraestructura_id, servicio, descripcion, cantidad, estado, funcionamiento, observaciones",
        camposView: [{ value: "desc_servicio", text: "Servicio" }, { value: "desc_descripcion", text: "Descripcion" },
        { value: "cantidad", text: "Cantidad" }, { value: "desc_estado", text: "Estado" }, { value: "desc_funcionamiento", text: "Funcionamiento" },
        ],
        key: ['institucion_id'],
        update: [],
        referer: [
            { ref: 'r_is_atributo as atr1', camporef: 'atr1.atributo_id', camporefForeign: 'servicio', alias: 'grupo_atributo', campos: 'atr1.atributo as desc_servicio', condicion: 'SERVICIOMEDICO' },
            { ref: 'r_is_atributo as atr2', camporef: 'atr2.atributo_id', camporefForeign: 'descripcion', alias: 'grupo_atributo', campos: 'atr2.atributo as desc_descripcion', condicion: 'SERVICIODESCMEDICO' },
            { ref: 'r_is_atributo as atr3', camporef: 'atr3.atributo_id', camporefForeign: 'estado', alias: 'grupo_atributo', campos: 'atr3.atributo as desc_estado', condicion: 'ESTRUCTURAESTADO' },
            { ref: 'r_is_atributo as atr4', camporef: 'atr4.atributo_id', camporefForeign: 'funcionamiento', alias: 'grupo_atributo', campos: 'atr4.atributo as desc_funcionamiento', condicion: 'FUNCIONA' },
        ],
    },

    mobiliarion: {
        table: 'r_institucion_salud_mobiliario',
        alias: 'Mobiliario',
        cardinalidad: "n",
        campos: "registro_id, servicio, descripcion, cantidad, estado, funcionamiento, anio_compra, fuente_financiamiento, observaciones, tipo_registro",
        camposView: [{ value: "desc_servicio", text: "Servicio" }, { value: "descripcion", text: "Descripcion" },
        { value: "cantidad", text: "Cantidad" }, { value: "desc_estado", text: "Estado" }, { value: "desc_funcionamiento", text: "Funcionamiento" },
        { value: "anio_compra", text: "Año Compra" }, { value: "desc_fuente_financiamiento", text: "Fuente Fin." }
        ],
        key: ['institucion_id'],
        precondicion: ["tipo_registro='MOBILIARIO'", "activo='Y'"],
        update: [],
        referer: [
            { ref: 'r_is_atributo as atr1', camporef: 'atr1.atributo_id', camporefForeign: 'servicio', alias: 'grupo_atributo', campos: 'atr1.atributo as desc_servicio', condicion: 'SERVICIOMEDICO' },
            { ref: 'r_is_atributo as atr2', camporef: 'atr2.atributo_id', camporefForeign: 'estado', alias: 'grupo_atributo', campos: 'atr2.atributo as desc_estado', condicion: 'ESTRUCTURAESTADO' },
            { ref: 'r_is_atributo as atr3', camporef: 'atr3.atributo_id', camporefForeign: 'funcionamiento', alias: 'grupo_atributo', campos: 'atr3.atributo as desc_funcionamiento', condicion: 'FUNCIONA' },
            { ref: 'r_is_atributo as atr4', camporef: 'atr4.atributo_id', camporefForeign: 'fuente_financiamiento', alias: 'grupo_atributo', campos: 'atr4.atributo as desc_fuente_financiamiento', condicion: 'FINANCIAMIENTOFUENTE' },
        ],
    },
    equipamienton: {
        table: 'r_institucion_salud_mobiliario',
        alias: 'Equipamiento',
        cardinalidad: "n",
        campos: "registro_id, servicio, descripcion, cantidad, estado, funcionamiento, anio_compra, fuente_financiamiento, observaciones, tipo_registro",
        camposView: [{ value: "desc_servicio", text: "Servicio" }, { value: "descripcion", text: "Descripcion" },
        { value: "cantidad", text: "Cantidad" }, { value: "desc_estado", text: "Estado" }, { value: "desc_funcionamiento", text: "Funcionamiento" },
        { value: "anio_compra", text: "Año Compra" }, { value: "desc_fuente_financiamiento", text: "Fuente Fin." }
        ],
        key: ['institucion_id'],
        precondicion: ["tipo_registro='EQUIPAMIENTO'", "activo='Y'"],
        update: [],
        referer: [
            { ref: 'r_is_atributo as atr1', camporef: 'atr1.atributo_id', camporefForeign: 'servicio', alias: 'grupo_atributo', campos: 'atr1.atributo as desc_servicio', condicion: 'SERVICIOMEDICO' },
            { ref: 'r_is_atributo as atr2', camporef: 'atr2.atributo_id', camporefForeign: 'estado', alias: 'grupo_atributo', campos: 'atr2.atributo as desc_estado', condicion: 'ESTRUCTURAESTADO' },
            { ref: 'r_is_atributo as atr3', camporef: 'atr3.atributo_id', camporefForeign: 'funcionamiento', alias: 'grupo_atributo', campos: 'atr3.atributo as desc_funcionamiento', condicion: 'FUNCIONA' },
            { ref: 'r_is_atributo as atr4', camporef: 'atr4.atributo_id', camporefForeign: 'fuente_financiamiento', alias: 'grupo_atributo', campos: 'atr4.atributo as desc_fuente_financiamiento', condicion: 'FINANCIAMIENTOFUENTE' },
        ],
    },

    personaln: {
        table: 'au_persona au',
        alias: 'Personal',
        cardinalidad: "n",
        campos: `au.dni_persona, au.tipo_dni, au.dni, au.dni_complemento,
        au.primer_apellido, au.segundo_apellido, au.casada_apellido, au.nombres,
        au.estado_civil, au.genero, au.nacionalidad, au.discapacidad,
        isp.nivel_instruccion, isp.item_contrato, isp.item_contrato_desc, isp.profesion_ocupacion, isp.profesion_ocupacion_especifica,
        isp.fuente_financiamiento, isp.descripcion_cargo, isp.carga_laboral, isp.personal_rotatorio, isp.item_desc_text`,

        camposView: [{ value: "desc_item_contrato", text: "Item/Contrato" }, { value: "primer_apellido", text: "Apellido" }, { value: "nombres", text: "Nombres" },
        { value: "dni_persona", text: "CI" }, { value: "desc_nivel_instruccion", text: "Nivel de Instruccion" }, { value: "desc_profesion_ocupacion", text: "Profesion/ocupacion" },
        { value: "desc_nacionalidad", text: "Nacionalidad" }
        ],
        key: ['isp.institucion_id'],
        precondicion: ["au.dni_persona = isp.dni_persona", "isp.activo='Y'"],
        update: [],
        referer: [
            { ref: 'r_is_atributo as atr1', camporef: 'atr1.atributo_id', camporefForeign: 'au.estado_civil', alias: 'grupo_atributo', campos: 'atr1.atributo as desc_estado_civil', condicion: 'PERESTADOCIVIL' },
            { ref: 'r_is_atributo as atr2', camporef: 'atr2.atributo_id', camporefForeign: 'au.genero', alias: 'grupo_atributo', campos: 'atr2.atributo as desc_genero', condicion: 'PERGENERO' },
            { ref: 'r_is_atributo as atr3', camporef: 'atr3.atributo_id', camporefForeign: 'au.nacionalidad', alias: 'grupo_atributo', campos: 'atr3.atributo as desc_nacionalidad', condicion: 'PERNACIONALIDAD' },
            { ref: 'r_is_atributo as atr33', camporef: 'atr33.atributo_id', camporefForeign: 'au.discapacidad', alias: 'grupo_atributo', campos: 'atr33.atributo as desc_discapacidad', condicion: 'AFIRMACION' },

            { tabla: 'r_institucion_salud_personal isp' },

            { ref: 'r_is_atributo as atr44', camporef: 'atr44.atributo_id', camporefForeign: 'isp.nivel_instruccion', alias: 'grupo_atributo', campos: 'atr44.atributo as desc_nivel_instruccion', condicion: 'PERNIVELINSTRUCCION' },
            { ref: 'r_is_atributo as atr4', camporef: 'atr4.atributo_id', camporefForeign: 'isp.item_contrato', alias: 'grupo_atributo', campos: 'atr4.atributo as desc_item_contrato', condicion: 'PERITEMCONTRATO' },
            { ref: 'r_is_atributo as atr5', camporef: 'atr5.atributo_id', camporefForeign: 'isp.item_contrato_desc', alias: 'grupo_atributo', campos: 'atr5.atributo as desc_item_contrato_desc', condicion: 'PERITEMCONTRATODESC' },
            { ref: 'r_is_atributo as atr6', camporef: 'atr6.atributo_id', camporefForeign: 'isp.profesion_ocupacion', alias: 'grupo_atributo', campos: 'atr6.atributo as desc_profesion_ocupacion', condicion: 'PERGRUPOPROFESION' },
            { ref: 'r_is_atributo as atr7', camporef: 'atr6.atributo_id', camporefForeign: 'isp.profesion_ocupacion_especifica', alias: 'grupo_atributo', campos: 'atr7.atributo as desc_profesion_ocupacion_especifica', condicion: 'PERGRUPOPROFESPECIFICA' },

            { ref: 'r_is_atributo as atr8', camporef: 'atr6.atributo_id', camporefForeign: 'isp.fuente_financiamiento', alias: 'grupo_atributo', campos: 'atr8.atributo as desc_fuente_financiamiento', condicion: 'FINANCIAMIENTOFUENTE' },
            { ref: 'r_is_atributo as atr9', camporef: 'atr6.atributo_id', camporefForeign: 'isp.descripcion_cargo', alias: 'grupo_atributo', campos: 'atr9.atributo as desc_descripcion_cargo', condicion: 'PERGRUPOPROFESION' },
            { ref: 'r_is_atributo as atr10', camporef: 'atr6.atributo_id', camporefForeign: 'isp.carga_laboral', alias: 'grupo_atributo', campos: 'atr10.atributo as desc_carga_laboral', condicion: 'PERCARGAHORARIA' },
            { ref: 'r_is_atributo as atr11', camporef: 'atr7.atributo_id', camporefForeign: 'isp.personal_rotatorio', alias: 'grupo_atributo', campos: 'atr11.atributo as desc_personal_rotatorio', condicion: 'AFIRMACION' },

        ],
    },
    personal: {
        table: 'au_persona au',
        alias: 'Personal',
        cardinalidad: "1",
        campos: {
            tipo_dni: ['Tido de identificacion', false, true, 'C'],
            dni: ['Numero Documento', false, true, 'T'],
            dni_complemento: ['Complemento', false, true, 'T'],
            fecha_nacimiento: ['Fecha Nacimiento', true, true, 'F'],
            primer_apellido: ['Primer Apellido', true, true, 'T'],
            segundo_apellido: ['Segundo Apellido', true, false, 'T'],
            nombres: ['Nombres', true, true, 'T'],
            estado_civil: ['Estado Civil', true, true, 'C'],
            genero: ['Genero', true, true, 'C'],
            nacionalidad: ['Nacionalidad', true, true, 'C'],
            discapacidad: ['Alguna Discapacidad', true, true, 'C'],
            telefono:['Telefono', true, true, 'T'],

        },
        key: ['dni_persona'],
        update: [],
        referer: [
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'tipo_dni', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'PERDNITIPO' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'estado_civil', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'PERESTADOCIVIL' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'genero', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'PERGENERO' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'nacionalidad', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'PERNACIONALIDAD' },
            { ref: 'atributos', camporef: 'atributo_id', camporefForeign: 'discapacidad', alias: 'grupo_atributo', campos: ['atributo_id', 'atributo'], condicion: 'AFIRMACION' },



        ],
    }

}

module.exports = {
    PARAMETROS,
}
