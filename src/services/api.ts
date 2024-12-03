import { AppError } from '@utils/app-error'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://192.168.15.8:3333',
})

api.interceptors.request.use((config) => {
    return config
}, (error) => {
    return Promise.reject(error)
})

api.interceptors.response.use((response) => {
    console.log("INTERCEPTOR RESPONSE =>", response)
    return response
}, (error) => {
    console.log("INTERCEPTOR RESPONSE ERROR =>", error)
    return Promise.reject(error)
})

api.interceptors.response.use(response => response, error => {
    if(error.response && error.response.data) {
        return Promise.reject(new AppError(error.response.data.message))
    } else {
        Promise.reject(Error)
    }
})

export { api }