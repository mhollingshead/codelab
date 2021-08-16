import axios from 'axios';

export const evaluateLua = inp => axios.post('http://localhost:8080/lua', {"data": inp});
export const evaluatePython = inp => axios.post('http://localhost:8080/python', {"data": inp});