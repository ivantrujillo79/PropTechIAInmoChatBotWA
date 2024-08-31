import { EVENTS, addKeyword } from '@builderbot/bot'
import { flujoRequisitosVenta } from './flujoMultimedia'

const flujoVenta = addKeyword(EVENTS.ACTION)
                    .addAnswer('Perfecto, a continuación le comparto un documento con los requisitos para iniciar un proceso de venta')
                    .addAction(async (_,{gotoFlow}) => {return gotoFlow(flujoRequisitosVenta)})

export { flujoVenta }
