import http, { RequestOptions } from 'http'

const requestOptions: RequestOptions = {
    protocol: 'http:',
    port: 3000,
    hostname: "localhost",
    path: "/v1/property",
    method: 'GET',
    headers: {
    'Content-Type': 'application/json'
    }
  }
  
class propertyDataService{

    static getAllProperties(){
        http.get("http://localhost:3000/v1/property", res => {
            let data = ""
          
            res.on("data", d => {
              data += d
            })
            res.on("end", () => {
              console.log(data)
              //Llamar a un Callback o resolver la promesa aquí.
            })
          })
    }
}

export default propertyDataService