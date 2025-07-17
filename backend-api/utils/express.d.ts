import User from "../models/users"

User
// Esta interface es para decirle a nuetro verificador de token que el req.usuario = {} osea extender la interface de la propiedad en el objeto req de express
declare global {
    namespace Express{
        interface Request {

            user?:{
                id:number,
                email:string,
                nombre?:string,
                imagen?:string | null,
                estado?:string | null,
            }

        }        
    }
}