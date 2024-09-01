import { EVENTS, createBot, createProvider, createFlow, addKeyword, utils, addAnswer} from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import propertyDataService from './service/propertyDataService'
import { join } from 'path'
import delay from 'delay'
import haversine from 'haversine-distance'
import https from 'https'

const PORT = process.env.PORT ?? 3008
let totalMensajes = 0
const ubicacionDepto = {"latitude":19.611710395475495 , "longitude":-99.19839983061134}

//With measurement objectives, who's using the QR code?
const QRScannedFlow = addKeyword<Provider, Database>('lciLxvv%2fP0e5dMiJ61hFsg%3d%3d')
.addAnswer([
    '🙌 Hola, soy el robot de Trujillo Bienes Raíces 🏘️🏢🏭'
    ,'gracias por scanear nuestro código QR, '
    ,'le atenderé para darle información acerca del departamento'
])
.addAnswer(
[
    'Por favor responda:',
    '1️⃣ Si le interesa *rentar* el departamento🏠',
    '2️⃣ Si quiere *comprar* el departamento💰',
    '3️⃣ Si quiere que alguien le llame por teléfono 📞',
    '4️⃣ Si quiere salir de este chat sin que le llamen 🚫'
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
            return endFlow(`De acuerdo le atenderemos llamando al número: ${ctx.from}, muchas gracias`)
        }
        if(userResponse === '4')
        {
            return endFlow(`De acuerdo, y recuerde escribir INFORMES para que pueda atenderlo nuevamente, que tenga buen día.`)
        }
        return fallBack('Escriba: 1️⃣ *Rentar* 2️⃣ *Comprar* 3️⃣ *Le llamaremos* 4️⃣*Terminar*')
    }
)

const welcomeFlow = addKeyword<Provider, Database>(['informes','información', 'informacion', 'datos', 'hola', 'costo', 'precio'])
    .addAnswer([
                    '🙌 Hola, soy el robot de Trujillo Bienes Raíces 🏘️🏢🏭'
                    ,'le atenderé para darle información acerca de las propiedades disponibles'
                ])
    .addAnswer(
        [
            'Por favor responda:',
            '1️⃣ Si le interesa *rentar* 🏠',
            '2️⃣ Si quiere *comprar* 💰',
            '3️⃣ Si quiere que alguien le llame por teléfono 📞',
            '4️⃣ Si quiere salir de este chat sin que le llamen 🚫'
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
                return endFlow(`De acuerdo le atenderemos llamando al número: ${ctx.from}, muchas gracias`)
            }
            if(userResponse === '4')
            {
                return endFlow(`De acuerdo, y recuerde escribir INFORMES para que pueda atenderlo nuevamente, que tenga buen día.`)
            }
            return fallBack('Escriba: 1️⃣ *Rentar* 2️⃣ *Comprar* 3️⃣ *Le llamaremos* 5️⃣*Terminar*')
        }
    )

    const flujoRenta = addKeyword(EVENTS.ACTION)
    .addAnswer(['El departamento se encuentra ubicado en la colonia Niños Heroes, ', 
                'Municipio de Cuautitlán Izcalli, es una tercer planta que cuenta con todos los servicios',
                'Electricidad, Agua, Drenaje, Gas natural (conexión al rentar), un lugar de estacionamiento',
                'El internet, teléfono y T.V. por cable es contratado por los inquilinos',
                'Excelentemente ubicado: Perinorte a 5 Min., Planta Ford a 15 Min. Planta Coca-Cola 20 Min.',
                'Conectado a las principales vías de comunicación, Periférico, Tren suburbano, Autopista Chamapa',
                'Vía López Portillo'
     ])
     .addAnswer(['¿Desea conocer los requisitos para rentarlo?',
                '1️⃣ para *SI*',
                '2️⃣ para *NO*'
     ].join('\n'),{capture: true},)
     .addAction(async (ctx, {fallBack, gotoFlow, endFlow}) => {
        const userResponse = ctx.body

        if(userResponse === '1' || userResponse.toLowerCase() === 'si')
        {
            return gotoFlow(requisitosRenta)
        }
        if( userResponse === '2' || userResponse.toLowerCase() === 'no')
        {
            return endFlow(`De acuerdo, y recuerde escribir INFORMES para que pueda atenderle nuevamente, que tenga buen día.`)
        }
        return fallBack('1 para si o 2 para no')
     })

     const requisitosRenta = addKeyword('djhsgiagbuiy237y88iynheudhlujd')
        .addAnswer(['El departamento es rentado tras la firma de una poliza jurídica ',
                    'previo pago de $2,400.00 a partes iguales con el arrendador',
                    'en la que se valida la fuente de ingreso del arrendatario, adeudos, ',
                    'demandas, referencias personales y laborales, copia de identificación oficial',
                    'IMPORTANTE: el monto sólo es aceptado una vez que el prospecto ha inspeccionado ',
                    'la propiedad y tiene claro el objetivo de la poliza, por lo anterior, por favor ',
                    'pregunte debido a que el importe no será reintegrado en caso de que el prospecto ',
                    'no cubra el perfil o decida no continuar con el proceso.']
                )
        .addAnswer(['¿Desea ver fotos de la propiedad?',
                    '1️⃣ para *SI*',
                    '2️⃣ para *NO*'
         ].join('\n'),{capture: true},)
         .addAction(async (ctx, {fallBack, gotoFlow, endFlow}) => {
            const userResponse = ctx.body

            if(userResponse === '1' || userResponse.toLowerCase() === 'si')
            {
                return gotoFlow(fotosRenta)
            }
            if( userResponse === '2' || userResponse.toLowerCase() === 'no')
            {
                return endFlow(`De acuerdo, y recuerde escribir INFORMES para que pueda atenderlo nuevamente, que tenga buen día.`)
            }
            return fallBack('1 para si o 2 para no')
         })
         
const fotosRenta = addKeyword('csfxcfhgcdvjbkjnklmñaiui6356')
    .addAnswer(`Sala comedor`, { media: join(process.cwd(), 'assets/Sept2024', 'SalaComedor1.jpg') })
    .addAnswer(`Cocina`, { media: join(process.cwd(), 'assets/Sept2024', 'Cocina1.jpg') })
    .addAnswer(`Cocina`, { media: join(process.cwd(), 'assets/Sept2024', 'Cocina2.jpg') })
    .addAnswer(`Cocina`, { media: join(process.cwd(), 'assets/Sept2024', 'Cocina3.jpg') })
    .addAnswer(`Zotehuela`, { media: join(process.cwd(), 'assets/Sept2024', 'Zotehuela3.jpg') })
    .addAnswer(`Recamara`, { media: join(process.cwd(), 'assets/Sept2024', 'Recamara1.jpg') })    
    .addAnswer(`Recamara`, { media: join(process.cwd(), 'assets/Sept2024', 'Recamara2.jpg') })    
    .addAnswer(`Recamara`, { media: join(process.cwd(), 'assets/Sept2024', 'Recamara4.jpg') })    
    .addAnswer(`Recamara`, { media: join(process.cwd(), 'assets/Sept2024', 'Recamara5.jpg') })    
    .addAnswer(`Recamara`, { media: join(process.cwd(), 'assets/Sept2024', 'Recamara6.jpg') })    
    .addAnswer(`Recamara`, { media: join(process.cwd(), 'assets/Sept2024', 'Recamara7.jpg') })  
    .addAnswer(`Baño`, { media: join(process.cwd(), 'assets/Sept2024', 'Baño1.jpg') })  
    .addAnswer(`Baño`, { media: join(process.cwd(), 'assets/Sept2024', 'Baño2.jpg') })  
    .addAnswer(`Baño`, { media: join(process.cwd(), 'assets/Sept2024', 'Baño3.jpg') })  
    .addAnswer(`Recorrido`, { media: join(process.cwd(), 'assets/Sept2024', 'VID-20240901-WA0009.mp4') })  
    .addAction(async (_,{gotoFlow}) => {
        await delay(5000)
        return gotoFlow(flujoCalculaDistancia)
    })

const flujoCalculaDistancia = addKeyword('675765CalculaDistanciauytuygbytuytw657658')
         .addAnswer('Para algunos clientes la distancia es importante, quizás actualmente renta y quiere un espacio cercano al que habita, por lo anterior, y si lo desea envíe su ubicación actual y le diremos qué tan distante se encuentra, así podrá elegir inteligentemente.');



const flujoUbica = addKeyword(EVENTS.LOCATION).addAction(
            async (ctx,{gotoFlow, state}) => {
                  const locationData = ctx.message.locationMessage;
                  const ubicacionProspecto = { latitude: locationData.degreesLatitude, longitude: locationData.degreesLongitude };
                  const distancia = await haversine(ubicacionProspecto, {"longitude": 19.611719, "latitude": 99.198404})/1000
                  await state.update({distanciaCalculada: distancia});
                  console.log(distancia / 1000)
        
                return gotoFlow(flujoLlamada);
            });
    
    
    const flujoLlamada = addKeyword(EVENTS.ACTION)
    .addAnswer('Calculando...', null, async (_, {state, flowDynamic}) => {
        const distancia = state.get('distanciaCalculada')
        await delay(2000)
        await flowDynamic([
            `La distancia desde su ubicación es de ${distancia/1000} Kms. `,
            '¿Cumple con los requisitos? ¿Le interesa rentar esta propiedad? si  así lo desea podemos contactarle telefónicamente para atender sus preguntas',
            '¿Gusta que le llamemos?',
            '1️⃣ para *Si*',
            '2️⃣ para *No*'
    ].join('\n'))
    })
    .addAnswer('', {capture: true},) 
    .addAction(async (ctx, {gotoFlow, fallBack, endFlow}) => {
        const userResponse = ctx.body
        

        if(userResponse === '1' || userResponse.toLowerCase() === 'si')
        {
            return gotoFlow(flujoRegistraLlamada)

        }
        if(userResponse === '2' || userResponse.toLowerCase() === 'no')
        {
            return endFlow(`De acuerdo, y recuerde escribir INFORMES para que pueda atenderlo nuevamente, que tenga buen día.`)
        }
        return fallBack('1 para si o 2 para no')
    })


    const flujoRegistraLlamada = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, {flowDynamic})=> {
        const numeroProspecto = ctx.from
        const options = {
            host: 's1z8h8ijff.execute-api.us-east-2.amazonaws.com',
            port: 443,
            path: '/dev/lead',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          };

          const postData = JSON.stringify({"Lead_ID":numeroProspecto})

          const req = https.request(options, (res) => {
      

          });

          req.write(postData);
          req.end();

        await flowDynamic(`De acuerdo, hemos registrado el número ${numeroProspecto} le llamaremos en breve.`)

    })
    .addAnswer('Registrando su llamada, espere.')

    const flujoCompra = addKeyword(EVENTS.ACTION).addAnswer('INFORMACIÓN para comprador')


const main = async () => {
    const adapterFlow = createFlow([QRScannedFlow, flujoRenta, requisitosRenta, fotosRenta, flujoLlamada, flujoUbica, flujoRegistraLlamada, welcomeFlow])
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

//export { welcomeFlow }
