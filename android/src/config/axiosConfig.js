import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthorizationInfo } from "../redux/selectors";

//axios.defaults.baseURL = 'https://coupl-bilkent.herokuapp.com/';
axios.defaults.baseURL = 'http://10.0.2.2:8000/';

const setupAxios = () => {

    const authorizationInfo = useSelector(selectAuthorizationInfo);

    useEffect(() => {

        //Request interceptor
        const requestInterceptor = axios.interceptors.request.use(
            async config => {
                const token = authorizationInfo.token;
                if (token) {
                    config.headers['Authorization'] = 'Bearer ' + token;
                }
                // config.headers['Content-Type'] = 'application/json';
                return config;
            },

            error => {

                //Maybe use something similar later
                //https://medium.com/swlh/handling-access-and-refresh-tokens-using-axios-interceptors-3970b601a5da
                /*
                const originalRequest = error.config;
                if (error.response.status === 401 && !originalRequest._retry) {

                    originalRequest._retry = true;
                    return axios.post('o/token/',
                        {
                            "refresh_token": localStorageService.getRefreshToken()
                        })
                        .then(res => {
                            if (res.status === 201) {
                                // 1) put token to LocalStorage
                                localStorageService.setToken(res.data);

                                // 2) Change Authorization header
                                axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorageService.getAccessToken();

                                // 3) return originalRequest object with Axios.
                                return axios(originalRequest);
                            }
                        })
                */
                Promise.reject(error)
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };

    }, [authorizationInfo]);

}

export default setupAxios;