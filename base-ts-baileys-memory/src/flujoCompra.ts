import { EVENTS,addKeyword } from '@builderbot/bot'
import {flujoDistancia } from './flujoDistancia'

let presupuesto = 0;
const totalIntentos = 5;
let intentoActual = 0;

const flujoCompraDepto = addKeyword(EVENTS.ACTION)
                            .addAnswer('De acuerdo, con el fin de agilizar su consulta, ¿Cuál es su presupuesto (Mayor a $800000) para comprar un departamento?'
                                ,{capture:true}
                                ,async (ctx,{fallBack,gotoFlow,endFlow,state}) => {
                                    if(!IsValidNumber(ctx.body))
                                    {
                                        intentoActual++;
                                        if(intentoActual >= totalIntentos)
                                        {
                                            intentoActual = 0
                                            return endFlow(`He detectado que ha intentado más de 5 veces, creo que tiene problemas para seguir con el proceso por lo que lo atenderemos llamando al número: ${ctx.from}, muchas gracias`)
                                        }
                                        return fallBack('El presupuesto debe ser un *Número* mayor a $800,000 por favor')
                                    }
                                    await state.update({ presupuesto: ctx.body })
                                    presupuesto = state.get('presupuesto')
                                    if(presupuesto > 800000){
                                        intentoActual = 0
                                        return gotoFlow(flujoDistancia)
                                    }
                                    else
                                    {
                                        intentoActual++;
                                        if(intentoActual >= totalIntentos)
                                        {
                                            intentoActual = 0
                                            return endFlow(`He detectado que ha intentado más de 5 veces, creo que tiene problemas para seguir con el proceso por lo que lo atenderemos llamando al número: ${ctx.from}, muchas gracias`)
                                        }
                                        return fallBack('El presupuesto debe ser mayor a $800,000 por favor')
                                    }
                                })

const flujoCompraCasa = addKeyword(EVENTS.ACTION)//(['casa','2'])
                            .addAnswer('De acuerdo, con el fin de agilizar su consulta, ¿Cuál es su presupuesto (Mayor a $1500000) para comprar una casa?'
                                ,{capture: true}
                                ,async (ctx,{fallBack,gotoFlow,endFlow,state}) => {
                                    if(!IsValidNumber(ctx.body))
                                        {
                                            intentoActual++;
                                            if(intentoActual >= totalIntentos)
                                            {
                                                intentoActual = 0
                                                return endFlow(`He detectado que ha intentado más de 5 veces, creo que tiene problemas para seguir con el proceso por lo que lo atenderemos llamando al número: ${ctx.from}, muchas gracias`)
                                            }
                                            return fallBack('El presupuesto debe ser un *Número* mayor a $1500000 por favor')
                                        }
    
                                    await state.update({ presupuesto: ctx.body })
                                    presupuesto = parseFloat(state.get('presupuesto'))
                                    if(presupuesto > 1500000){
                                        intentoActual = 0
                                        return gotoFlow(flujoDistancia)
                                    }
                                    else
                                    {
                                        intentoActual++;
                                        if(intentoActual >= totalIntentos)
                                        {
                                            intentoActual = 0
                                            return endFlow(`He detectado que ha intentado más de 5 veces, creo que tiene problemas para seguir con el proceso por lo que lo atenderemos llamando al número: ${ctx.from}, muchas gracias`)
                                        }                                        
                                        return fallBack('El presupuesto debe ser (Mayor a $1,500,000)')
                                    }
                                }
                            )        


const IsValidNumber = (input: string): boolean =>
{
    const regex = new RegExp(/^[0-9]+$/)
    return regex.test(input);
}

export {flujoCompraCasa, flujoCompraDepto}