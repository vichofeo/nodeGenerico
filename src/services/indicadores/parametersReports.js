'use strict'

const REPORTS = {

  rAbastecimiento: {
    literal: true,
    attributes: 'r.periodo, COUNT(*) as registros',
    table: 'upf_registro r, uf_abastecimiento a',
    conditional: "r.registro_id =  a.registro_id AND r.concluido='7'",
    order: 'GROUP BY 1 ORDER BY 1 DESC',
    keySession: { replaceKey: false, campo: 'r.institucion_id' },

    tables: `ae_institucion i, ae_institucion eg, al_departamento d, upf_registro r, uf_abastecimiento ll 
              LEFT JOIN  uf_liname l  ON (ll.cod_liname=l.cod_liname )`,
    alias: 'Datos de Abastecimiento de Farmacias',
    campos: `eg.nombre_institucion AS eg, d.nombre_dpto AS dpto, i.nombre_institucion AS eess,SUBSTR(r.periodo,1,4) as gestion,  r.periodo, TO_CHAR(TO_DATE(r.periodo, 'YYYY-MM'), 'month') as mes,
    ll.cod_liname, ll.grupo, ll.variable, ll.subvariable,
    ll.medicamento ||' '|| COALESCE(l.concentracion,'')  AS descripcion, ll.forma_farmaceutica AS presentacion, 
    COALESCE(l.cod_liname,'-NO-REGISTRADO-') as c_liname, COALESCE(l.medicamento,'') ||' '|| COALESCE(l.concentracion,'')  AS dsc_liname, COALESCE(l.forma_farmaceutica,'') AS frm_liname,
    to_char(ll.fecha_vencimiento,'dd/mm/yyyy') AS fvencimiento, ll.reg_sanitario, ll.consumo_mensual, ll.ingresos, ll.egresos, ll.transferencias, ll.saldo_stock AS stock,
    case ll.consumo_mensual  WHEN 0 THEN 0  else round ((ll.saldo_stock/ll.consumo_mensual)::DECIMAL) END as tmes,
    
    CASE  WHEN (ll.fecha_vencimiento - CURRENT_DATE)>60
                THEN 'Vigente'
                WHEN (ll.fecha_vencimiento - CURRENT_DATE)>0 and (ll.fecha_vencimiento - CURRENT_DATE) <=60
                THEN 'Vencimiento proximo'
                WHEN (ll.fecha_vencimiento - CURRENT_DATE)<0
                THEN 'Vencido'
                ELSE 'N/A' END  AS alertax23,
    CASE ll.consumo_mensual WHEN  0 THEN 'Sobre Stock'
          ELSE CASE WHEN (ll.saldo_stock/ll.consumo_mensual)=0 THEN 'Stock cero' 
          WHEN (ll.saldo_stock/ll.consumo_mensual)>0 AND  (ll.saldo_stock/ll.consumo_mensual)<= 3 THEN 'Sub-Stock'
          WHEN (ll.saldo_stock/ll.consumo_mensual)>3 THEN 'Normo Stock'
          ELSE '-Indeterminado-' END 
END AS alertaxs23
    `,
    headers: ['ENTE GESTOR', 'DEPARTAMENTO', 'ESTABLECIMIENTO SALUD', 'GESTION','PERIODO', 'MES',
      'CODIGO/ ITEM', 'GRUPO', 'VARIABLE', 'SUBVARIABLE',
      'DESCRIPCIÓN DEL MEDICAMENTO/CONCENTRACION', 'PRESENTACION', 
      'COD-LINAME', 'DESC-MED-LINAME', 'PRESEN-LINAME', 
      'FECHA VENCIMIENTO', 'REGISTRO SANITARIO', 'CONSUMO MENSUAL', 'INGRESOS', 'EGRESOS', 'TRANSFERENCIAS', 'SALDOS/STOCK',
      'TIEMPO EN MESES', 'ESTADO VIGENCIA', 'ESTADO STOCK'
    ],
    tipo: 'Sum',
    camposOcultos: ['CONSUMO MENSUAL', 'INGRESOS', 'EGRESOS', 'TRANSFERENCIAS', 'SALDOS/STOCK'],
    rows: ['COD-LINAME', 'DESCRIPCIÓN DEL MEDICAMENTO/CONCENTRACION', 'PRESENTACION', 'FECHA VENCIMIENTO', 'REGISTRO SANITARIO'],
    cols: ['DEPARTAMENTO'],
    mdi: 'mdi-medical-bag',

    precondicion: ['r.institucion_id = i.institucion_id', 'i.cod_pais=d.cod_pais', 'i.cod_dpto = d.cod_dpto', 'i.institucion_root = eg.institucion_id',
      'r.registro_id=ll.registro_id', 'll.swloadend =  true', "r.concluido='7'"],
    referer: [],
    //condicionSolicitud: function(){return `to_char(fecha_dispensacion, 'YYYY')='${dato}'`}
    metodo: function (dato = Array()) {
      let sentencia = ''
      if (Array.isArray(dato)) {
        dato = dato.map((o) => o.periodo)

        if (dato.length == 1 && dato[0] == 'Todos') sentencia = ['1=1']
        else
          sentencia = dato.map(
            (val) => `periodo='${val}'`
          )

        sentencia = `( ${sentencia.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  

}

module.exports = REPORTS
