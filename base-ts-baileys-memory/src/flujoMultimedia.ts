import { EVENTS, createBot, createProvider, createFlow, addKeyword, utils, addAnswer} from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { join } from 'path'
import { welcomeFlow } from './app'
import delay from 'delay'


const flujoDetallesRenta = addKeyword<Provider, Database>(['samples', utils.setEvent('SAMPLES')])
    .addAnswer(`Propiedad en renta: AV. Vasconcelos #365, Col. El Rosario, Del. Azcapotzalco`)
    .addAnswer(`Fachada propiedad`, { media: join(process.cwd(), 'assets', 'descarga.jpeg') })
    .addAnswer(`Sala propiedad`, { media: join(process.cwd(), 'assets', 'Sala.webp') })    
    .addAnswer(`Video jardín de la propiedad`, {
        media: 'https://onlinetestcase.com/wp-content/uploads/2023/06/1MB.mp4',
    })
    .addAnswer(`Nota de audio`, { media: 'https://cdn.freesound.org/previews/728/728142_11861866-lq.mp3' })
    .addAnswer(`Archivo Guía Inquilino`, {
        media: 'https://multco-web7-psh-files-usw2.s3-us-west-2.amazonaws.com/s3fs-public/health/documents/rent_right_resource_guide_spanish.pdf',
    })
    .addAction(async (_,{gotoFlow}) => {
        await delay(15000)
        return gotoFlow(welcomeFlow)
    })

 const flujoRequisitosVenta = addKeyword('vender936472h')
                                .addAnswer(`Archivo Guía Vendedor`, {
                                    media: 'https://century21sinow.com/src/assets/pdf/guia-vender.pdf',
                                }, async (ctx,{flowDynamic}) => {
                                    return await flowDynamic(`Por favor lea el documento, más tarde nos pondremos en contacto con usted al número: ${ctx.from}, para responder sus preguntas.`)
                                })
                                .addAction(async (_, {gotoFlow}) => {
                                    await delay(15000)
                                    return gotoFlow(welcomeFlow)
                                })

const flujoRequisitosCompra = addKeyword('7687643comprar893879837j')
                                .addAnswer(`Esperamos que esta Guía del Comprador le sea de utilidad`, {
                                    media: 'https://century21sinow.com/src/assets/pdf/guia-comprar.pdf',
                                })
                                .addAction(async (_,{gotoFlow}) => {
                                    await delay(15000)
                                    return gotoFlow(welcomeFlow)
                                })


export {flujoDetallesRenta, flujoRequisitosVenta, flujoRequisitosCompra}