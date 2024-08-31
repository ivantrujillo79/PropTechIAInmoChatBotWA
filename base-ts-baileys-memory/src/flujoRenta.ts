import {EVENTS,addKeyword } from '@builderbot/bot'
import {flujoDistancia } from './flujoDistancia'

let presupuesto = 0;
const totalIntentos = 5;
let intentoActual = 0;

const flujoRentaDepto = addKeyword(EVENTS.ACTION)
                            .addAnswer('De acuerdo, con el fin de agilizar su consulta, ¿Cuál es su presupuesto (Mayor a $5,000) para rentar un departamento?'
                                ,{capture:true} //, buttons: [ {body: '5Mil a 7Mil'}, {body: '7.5Mil a 9Mil'}] DEPRECATED, ONLY AVAILABLE WITH META AND TWILIO
                                , async (ctx,{fallBack,gotoFlow,endFlow,state}) =>{
                                    if(!IsValidNumber(ctx.body))
                                        {
                                            intentoActual++;
                                            if(intentoActual >= totalIntentos)
                                            {
                                                intentoActual = 0
                                                return endFlow(`He detectado que ha intentado más de 5 veces, creo que tiene problemas para seguir con el proceso por lo que lo atenderemos llamando al número: ${ctx.from}, muchas gracias`)
                                            }
                                            return fallBack('El presupuesto debe ser un *Número* mayor a $5000 por favor')
                                        }                                    
                                    await state.update({ presupuesto: ctx.body })
                                    presupuesto = state.get('presupuesto')
                                    if(presupuesto < 5000){
                                        intentoActual++;
                                        if(intentoActual >= totalIntentos)
                                        {
                                            intentoActual = 0
                                            return endFlow(`He detectado que ha intentado más de 5 veces, creo que tiene problemas para seguir con el proceso por lo que lo atenderemos llamando al número: ${ctx.from}, muchas gracias`)
                                        }
                                        return fallBack('El presupuesto debe ser mayor a $5,000 por favor')
                                    }
                                    else{
                                        intentoActual = 0;
                                        return gotoFlow(flujoDistancia)
                                    }
                                })

const flujoRentaCasa = addKeyword(EVENTS.ACTION)
                            .addAnswer('De acuerdo, con el fin de agilizar su consulta, ¿Cuál es su presupuesto (Mayor a $15,000) para rentar una casa?'
                                ,{capture:true}
                                , async (ctx,{fallBack,gotoFlow, endFlow,state}) => {
                                    if(!IsValidNumber(ctx.body))
                                        {
                                            intentoActual++;
                                            if(intentoActual >= totalIntentos)
                                            {
                                                intentoActual = 0
                                                return endFlow(`He detectado que ha intentado más de 5 veces, creo que tiene problemas para seguir con el proceso por lo que lo atenderemos llamando al número: ${ctx.from}, muchas gracias`)
                                            }
                                            return fallBack('El presupuesto debe ser un *Número* mayor a $15000 por favor')
                                        }
                                    await state.update({ presupuesto: ctx.body })
                                    const presupuesto = state.get('presupuesto')
                                    if(presupuesto < 15000){
                                        intentoActual++;
                                        if(intentoActual >= totalIntentos)
                                        {
                                            intentoActual = 0
                                            return endFlow(`He detectado que ha intentado más de 5 veces, creo que tiene problemas para seguir con el proceso por lo que lo atenderemos llamando al número: ${ctx.from}, muchas gracias`)
                                        }
                                        return fallBack('El presupuesto debe ser mayor a $15,000 por favor')
                                    }
                                    else{
                                        intentoActual = 0;
                                        return gotoFlow(flujoDistancia)
                                    }                                
                                })

const IsValidNumber = (input: string): boolean =>
{
    const regex = new RegExp(/^[0-9]+$/)
    return regex.test(input);
}

export {flujoRentaDepto, flujoRentaCasa}
