import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'D3m0cr1t0#',
    database: 'realstate'
}

const connection = await mysql.createConnection(config)



class PropertyType{
 /*   static async getAllPropertyType(){
        const [results, fields] = await connection.query('SELECT ID,Description FROM PropertyType;')
        console.log(results)
        console.log(fields)
    }

    static async getAllProperties(){
        const [results, fields] = await connection.query('SELECT ID,ShortID,Street,Neighborhood,Zip,OwnerID FROM Property;')
        console.log(results)
        console.log(fields)
    }
*/
}

export default PropertyType