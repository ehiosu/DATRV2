import axios from 'axios'
const baseURL="http://localhost:8080"
export default function createAxiosClient(access="",refresh="",updateTokens,getNewToken){
    const instance=axios.create({
        baseURL,
        withCredentials:true
    })
    
    instance.interceptors.request.use((config)=>{
        config.headers = {Authorization : `Bearer ${access}`}
        return config
    })
    
    instance.interceptors.response.use((response)=>{
        return response
    },async (error)=>{
        const originalRequest=error.config
        if(error.response.status===401 && !originalRequest._retry){
            originalRequest._retry=true
            const newTokens=(await getNewToken(refresh)).json()
            updateTokens(newTokens)
            return instance(originalRequest)
        }
        return Promise.reject(error)
    })
    return instance
}