import { EVENTS, createBot, createProvider, createFlow, addKeyword, utils, addAnswer} from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { flujoRentaDepto, flujoRentaCasa } from './flujoRenta'
import { flujoCompraCasa, flujoCompraDepto } from './flujoCompra'
import { flujoDistancia , flujoUbica } from './flujoDistancia'
import { flujoDetallesRenta, flujoRequisitosVenta, flujoRequisitosCompra } from './flujoMultimedia'
import { flujoVenta } from './flujoVenta'
import propertyDataService from './service/propertyDataService'

const PORT = process.env.PORT ?? 3008
let totalMensajes = 0

const flujoRenta = addKeyword(EVENTS.ACTION)
                    .addAnswer([
                        '¿Qué tipo de propiedad deseas rentar?'
                        ,'*1️⃣ Departamento*'
                        ,'*2️⃣ Casa*'
                    ])
                    .addAction({capture: true}, async (ctx,{gotoFlow, fallBack, state}) => {
                        const opcionElegida = ctx.body;
                        await state.update({tipoOperacion: 'Renta'});
                        if(opcionElegida === '1')
                        {
                            return gotoFlow(flujoRentaDepto)
                        }
                        if(opcionElegida === '2')
                        {
                            return gotoFlow(flujoRentaCasa)
                        }
                        return fallBack('Escriba: *1️⃣ Departamento* o *2️⃣ Casa*')
                    })

const flujoCompra = addKeyword(EVENTS.ACTION)
                        .addAnswer([
                            '¿Qué tipo de propiedad deseas comprar?'
                            ,'*1️⃣ para departamento*'
                            ,'*2️⃣ para casa*'
                        ]
                        )
                        .addAction({capture: true}, async (ctx,{gotoFlow, fallBack, state}) => {
                            const opcionElegida = ctx.body;
                            await state.update({tipoOperacion: 'Compra'});
                            if(opcionElegida === '1')
                            {
                                return gotoFlow(flujoCompraDepto)
                            }
                            if(opcionElegida === '2')
                            {
                                return gotoFlow(flujoCompraCasa)
                            }
                            return fallBack('Escriba: *1️⃣ Departamento* o *2️⃣ Casa*')
                        })
                        
const welcomeFlow = addKeyword<Provider, Database>(['informes','información', 'informacion', 'datos'])
    .addAnswer([
                    '🙌 Hola, soy el robot de Trujillo Bienes Raíces 🏘️🏢🏭'
                    ,'le atenderé para darle información acerca de las propiedades disponibles'
                ])
    .addAnswer(
        [
            'Por favor responda:',
            '1️⃣ Si le interesa *rentar* 🏠',
            '2️⃣ Si quiere *comprar* 💰',
            '3️⃣ Si quiere *vender* 📜',
            '4️⃣ Si quiere que alguien le llame por teléfono 📞',
            '5️⃣ Si quiere salir de este chat sin que le llamen 🚫'
        ].join('\n'),
        {capture: true},)
        .addAction(async (ctx,{fallBack, gotoFlow, endFlow}) => {
            const userResponse = ctx.body;
            if(userResponse === '1')
            {
                return gotoFlow(flujoRenta)
            }
            if(userResponse === '2')
            {
                return gotoFlow(flujoCompra)
            }
            if(userResponse === '3')
            {
                return gotoFlow(flujoVenta)
            }
            if(userResponse === '4')
            {
                return endFlow(`De acuerdo le atenderemos llamando al número: ${ctx.from}, muchas gracias`)
            }
            if(userResponse === '5')
            {
                return endFlow(`De acuerdo, y recuerde escribir INFORMES para que pueda atenderlo nuevamente, que tenga buen día.`)
            }
    

            return fallBack('Escriba: 1️⃣ *Rentar* 2️⃣ *Comprar* 3️⃣ *Vender* 4️⃣ *Le llamaremos* 5️⃣*Terminar*')
        }
    )


const main = async () => {
    const adapterFlow = createFlow([welcomeFlow, flujoDetallesRenta, flujoDistancia, flujoUbica, flujoRenta, flujoCompra,
        flujoRentaDepto, flujoRentaCasa, flujoCompraCasa, flujoCompraDepto, flujoVenta, flujoRequisitosVenta, flujoRequisitosCompra])
    const adapterProvider = createProvider(Provider, {name:'RealStateBot'})
    const adapterDB = new Database()

    adapterProvider.on('message',() => { totalMensajes++; console.log('Mensaje recibido, total mensajes: ', totalMensajes) })

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

   adapterProvider.server.get('/v1/propiedad', handleCtx(async(bot, req, res) => {
        const results  = propertyDataService.getAllProperties();
        console.log(results);
        return res.end(JSON.stringify([{ID: '873873jw', address: 'Kiosco SC 1423, CARRETERA CUAUTITLAN-TULTEPEC Cuautitlán Izcalli, Estado de Mexi 2, El Terremoto, 54850 Cuautitlán, Méx.', georeference:{latitude: 19.679608539013934, longitude: -99.14830138813953}},
            {ID: '20203jd', address: 'Paseos de Cuautitlan, 54800 Cuautitlán, Méx.', georeference:{latitude: 19.667988624014924, longitude: -99.17592544890967}},
        {ID:'30304hjjdh', address: 'Av. Miguel Ángel de Quevedo 531, Romero de Terreros, Coyoacán, 04310 Ciudad de México, CDMX', georeference:{latitude: 19.3447983819366, longitude: -99.16872718708929}}]
        ))
    }))

    httpServer(+PORT)
}

main()

export { welcomeFlow }
