const HandleErrors = require('../../utils/handleErrors')
const QUtils = require('./../../utils/queries/Qutils')
const qUtil = new QUtils()

const handleJwt = require('./../../utils/handleJwt')


const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const pcboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(pcboxs)

const FrmUtils = require('./../frms/FrmsUtils')
const { actividad } = require('./parameters')
const frmUtil = new FrmUtils()



const getAllProg = async (dto, handleError) => {
    try {
        frmUtil.setToken(dto.token)
        const obj_cnf = frmUtil.getObjSession()

        //const cnf_actividad = 

        const idx = dto.idx
        qUtil.setTableInstance('ae_institucion')
        qUtil.setAttributes([['institucion_id', 'id'], ['nombre_institucion', 'content'], [qUtil.literal("1"), 'treeLevel']],)

        //qUtils.setOrder([qUtils.getGestor().col('sections.orden'), qUtils.getGestor().col('sections.questions.orden'), qUtils.getGestor().col('sections.questions.answers.orden'), qUtils.getGestor().col('sections.questions.questions.orden')])
        qUtil.setOrder(['tipo_institucion_id', qUtil.col('children.tipo_institucion_id')])

        let cnf = {
            association: 'children',
            attributes: [['institucion_id', 'id'], ['nombre_institucion', 'content'], [qUtil.literal("2"), 'treeLevel']],
            required: false,
            where: { tipo_institucion_id: qUtil.distinto('EESS') },
            include: [
                {
                    association: 'children',
                    attributes: [['institucion_id', 'id'], ['nombre_institucion', 'content'], [qUtil.literal("3"), 'treeLevel']],
                    required: false,
                    where: { tipo_institucion_id: qUtil.distinto('EESS') },
                    include: [{
                        required: false,
                        association: 'actividad',
                        attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], [qUtil.literal("4"), 'treeLevel'], ['institucion_id', 'group']],
                        where: { actividad_root: null },
                        include: [{
                            association: 'subactividad',
                            required: false,
                            attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], ['actividad_root', 'groupId'], ['actividad_root', 'group'], 'full_dia'],
                            where: { activo: 'Y' }
                        }]
                    }]

                },
                {
                    required: false,
                    association: 'actividad',
                    attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], [qUtil.literal("2"), 'treeLevel']],
                    where: { actividad_root: null },
                    include: [{
                        association: 'subactividad',
                        required: false,
                        attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], ['actividad_root', 'groupId'], ['actividad_root', 'group'], 'full_dia'],
                        where: { activo: 'Y' }
                    }]
                }
            ],
        }
        qUtil.setInclude(cnf)
        //included Actvidades
        cnf = {
            required: false,
            association: 'actividad',
            attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], [qUtil.literal("1"), 'treeLevel']],
            where: { actividad_root: null },
            include: [{
                association: 'subactividad',
                required: false,
                attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], ['actividad_root', 'groupId'], ['actividad_root', 'group'], 'full_dia'],
                where: { activo: 'Y' }
            }]
        }
        qUtil.pushInclude(cnf)

        qUtil.setWhere({ institucion_root: idx })

        await qUtil.findTune()
        const r = qUtil.getResults()
        return {
            ok: true,
            data: r,
            message: 'Resultado exitoso. Parametros obtenidos',
        }


    } catch (error) {
        console.log(error);
        handleError.setMessage("Error de sistema: PRODATSRV")
        handleError.setHttpError(error.message)
    };

}

module.exports = {
     getAllProg
}