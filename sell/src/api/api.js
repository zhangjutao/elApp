/* eslint-disable */
import axios from 'axios'

//let contextPath = '/'

// create an axios instance
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 5000 // request timeout
  })



// 获取数据
export const getSellers = () => {
    return service.get('/sellers'
    ).then(res => res.data)
}

export const getGoods = () => {
    return service.get('/goods'
    ).then(res => res.data)
}

export const getRatings = () => {
    return service.get('/ratings'
    ).then(res => res.data)
}