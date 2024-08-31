import { EVENTS, addKeyword} from '@builderbot/bot'
import haversine from 'haversine-distance'
import { flujoDetallesRenta, flujoRequisitosCompra } from './flujoMultimedia'
import delay from 'delay'
import http from 'http'
import https from 'https'

let respuesta = '0'
let tipoOperacion = ''

const flujoDistancia = addKeyword('yugyghuy67656786preguntaDistanciau65675675')
                        .addAnswer([
                            '¿Desea que haga una búsqueda de propiedades a 5 kms a la redonda basado en su ubicación actual?'
                            ,'1️⃣ Si'
                            ,'2️⃣ No']
                            ,{capture: true},
                            async (ctx,{flowDynamic,gotoFlow,state}) => {
                                await state.update({ respuesta: ctx.body })
                                respuesta = state.get('respuesta')
                                if(respuesta == '1' || respuesta.toLowerCase() == 'si'){
                                    return gotoFlow(flujoCalculaDistancia)
                                }
                                else
                                {
                                    await flowDynamic('⏱️ De acuerdo, no usaremos su ubicación, en este momento se inicia la consulta a nuestra base de datos, por favor espere unos segundos ⏱️')
                                    await delay(5000)
                                    tipoOperacion = state.get('tipoOperacion')
                                    console.log('Tipo Operación: ', tipoOperacion)
                                    if(tipoOperacion == 'Renta')
                                    {
                                        return gotoFlow(flujoDetallesRenta)
                                    }
                                    if(tipoOperacion == 'Compra'){
                                        return gotoFlow(flujoRequisitosCompra)
                                    }
                                }
                            }
                        )

const flujoCalculaDistancia = addKeyword('675765CalculaDistanciauytuygbytuytw657658')
    .addAnswer('Por favor envíe su ubicación actual');

const flujoUbica = addKeyword(EVENTS.LOCATION).addAnswer('Distancia: ',null,
    async (ctx,{gotoFlow,flowDynamic, state}) => {
        const options = {
            host: 'localhost',
            port: 3008,
            path: '/v1/propiedad',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          };
          const propiedades = [];
          const propiedadesEnRango = [];
          getJSON(options, (statusCode, result) => {
            console.log(`onResult: (${statusCode})\n\n${JSON.stringify(result)}`);
            
            result.map(x => { propiedades.push(x) });
            console.log('Propiedades: ', propiedades);

            const locationData = ctx.message.locationMessage;
            const ubicacionProspecto = { latitude: locationData.degreesLatitude, longitude: locationData.degreesLongitude };
            propiedades.forEach(y => {
                const distancia = haversine(ubicacionProspecto, y.georeference)/1000
                if(distancia <= 6.0)
                {
                    propiedadesEnRango.push(y);
                    console.log(distancia);
                }
            })
                
            console.log('Propiedades en rango:', propiedadesEnRango);

            result.statusCode = statusCode;
            //result.send(result);
          });

        return gotoFlow(flujoDetallesRenta);
    });


    const getJSON = (options, onResult) => {
        console.log('rest::getJSON');
        const port = http;//options.port == 3008 ? https : http;
        let output = '';
        const req = port.request(options, (res) => {
          console.log(`${options.host} : ${res.statusCode}`);
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            output += chunk;
          });
          res.on('end', () => {
            const obj = JSON.parse(output);
            onResult(res.statusCode, obj);
          });
        });
        req.on('error', (err) => {
          console.log('error: ' + err.message);
        });
        req.end();
      };



export {flujoDistancia, flujoUbica, flujoCalculaDistancia}