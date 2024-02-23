import instance from "../api/axios"
const baseURL='http://localhost:8080/'
export const getNewToken=async(token)=>{
return instance.get(`${baseURL}users/refresh/token`)
}