// import axios from 'axios';

// const baseURL = "http://localhost:8080/api/";

// export default function createAxiosClient(access = "", refresh = "", updateTokens, getNewToken) {
//     const instance = axios.create({
//         baseURL,
//         withCredentials: true
//     });

//     instance.interceptors.request.use((config) => {
//         config.headers = { Authorization: `Bearer ${access}` };
//         return config;
//     });

//     instance.interceptors.response.use(
//         (response) => {
//             return response;
//         },
//         async (error) => {
//             const originalRequest = error.config;
    
//             if (error.response.data.message === "Full authentication is required to access this resource: username or password is invalid") {
//                 console.log("Rejected due to invalid authentication");
//                 return Promise.reject(error);
//             }
    
//             if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
//                 originalRequest._retry = true;
//                 let newTokens;
    
//                 try {
//                     const resp = await getNewToken(refresh);
//                     newTokens = resp.data;
    
//                     console.log("New tokens obtained:", newTokens);
    
//                     updateTokens(newTokens);
//                     originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
    
//                     console.log("Retrying original request with new tokens...");
//                     return instance(originalRequest);
//                 } catch (refreshError) {
//                     console.error("Error refreshing tokens:", refreshError);
//                     return Promise.reject(refreshError);
//                 }
//             }
    
//             return Promise.reject(error);
//         }
//     );

//     return instance;
// }


import axios from 'axios';

const baseURL = "http://localhost:8080/api/";

export default function createAxiosClient(access = "", refresh = "", updateTokens, getNewToken) {
    const instance = axios.create({
        baseURL,
        withCredentials: true
    });

    instance.interceptors.request.use((config) => {
        config.headers = { Authorization: `Bearer ${access}` };
        return config;
    });

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            if (error.response.status === 401 && error.response.data.error_message && error.response.data.error_message.includes("Token has expired") || error.response.status=== 403) {
                console.log("Token has expired. Attempting token refresh...");

                if (!originalRequest._retry) {
                    originalRequest._retry = true;
                    let newTokens;

                    try {
                        const resp = await getNewToken(refresh);
                        newTokens = resp.data;

                        console.log("New tokens obtained:", newTokens);

                        updateTokens(newTokens);
                        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;

                        console.log("Retrying original request with new tokens...");
                        return instance(originalRequest);
                    } catch (refreshError) {
                        console.error("Error refreshing tokens:", refreshError);
                        return Promise.reject(refreshError);
                    }
                } else {
                    console.error("Token refresh already attempted. Rejecting request.");
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
}
