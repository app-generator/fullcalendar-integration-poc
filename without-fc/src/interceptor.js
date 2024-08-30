import axios from 'axios';
import Cookies from 'js-cookie';
import qs from 'qs';

export const NXTBN_API_URL = process.env.REACT_APP_NXTBN_API_URL || "http://localhost:8000/";

const useInterceptors = () => {
    const instance = axios.create({
        baseURL: NXTBN_API_URL,
        timeout: 10000,
        withCredentials: true,  // This allows cookies (including session and CSRF tokens) to be sent with requests
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    instance.defaults.timeout = 10000;
    instance.defaults.headers.common['Content-Type'] = 'application/json';
    instance.defaults.headers.common['Accept'] = 'application/json';

    instance.interceptors.request.use(
        config => {
            // Fetch CSRF token from cookies
            const csrfToken = Cookies.get('csrftoken');
            console.log('CSRF Token:', csrfToken);  // Log the CSRF token to verify it's being fetched
            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;  // Include the CSRF token in the headers
            }

            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        response => {
            return response.data;
        },
        error => {
            if (error.response) {
                if (error.response.status === 500) {
                    var normalizedError = { 
                        response: {
                            data: {
                                'server': ["Standard: Internal Server Error"]
                            }
                        }
                    };
                    return Promise.reject(normalizedError);
                } else if (error.response.status === 403) {
                    // Handle 403 error
                } else if (error.response.status === 404) {
                    // Handle 404 error
                } else if (error.response.status === 400) {
                    // Handle 400 error
                } else if (error.response.status === 409) {
                    // Handle 409 error
                } else if (error.response.status === 401) {
                    // Handle 401 error
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
}

export default useInterceptors;
