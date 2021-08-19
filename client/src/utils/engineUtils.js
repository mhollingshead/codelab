import axios from 'axios';

export const getVersion = lang => axios.get(`http://localhost:8080/version/${lang}`);