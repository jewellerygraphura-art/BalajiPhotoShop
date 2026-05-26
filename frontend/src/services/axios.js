import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const axiosPostService = async (path, client) => {
    try {
        let response = await axios.post(
            `${API_URL}${path}`,
            client,
            {
                withCredentials: true
            }
        );

        return { ok: true, fetchMessage: true, data: response.data };
    }
    catch (err) {
        if (err.response) {
            return { ok: false, fetchMessage: true, data: err.response.data };
        }
        else {
            return { ok: false, fetchMessage: false, data: err.message }
        }
    }
}

export const axiosPutService = async (path, client) => {
    try {
        let response = await axios.put(
            `${API_URL}${path}`,
            client,
            {
                withCredentials: true,
            }
        );

        return { ok: true, fetchMessage: true, data: response.data };
    }
    catch (err) {
        if (err.response) {
            return { ok: false, fetchMessage: true, data: err.response.data };
        }
        else {
            return { ok: false, fetchMessage: false, data: err.message }
        }
    }
}

export const axiosGetService = async (path) => {
    try {
        const response = await axios.get(
            `${API_URL}${path}`,
            { withCredentials: true }
        );

        return { ok: true, fetchMessage: true, data: response.data };
    }
    catch (err) {
        if (err.response) {
            return { ok: false, fetchMessage: true, data: err.response.data }
        }
        else {
            return { ok: false, fetchMessage: false, data: err.message }
        }
    }
}

export const axiosDeleteService = async (path) => {
    try {
        let response = await axios.delete(
            `${API_URL}${path}`,
            {
                withCredentials: true
            }
        );

        return { ok: true, fetchMessage: true, data: response.data };
    }
    catch (err) {
        if (err.response) {
            return { ok: false, fetchMessage: true, data: err.response.data };
        }
        else {
            return { ok: false, fetchMessage: false, data: err.message }
        }
    }
}

/* ===========================
   SEARCH PRODUCTS API
=========================== */
export const searchProductsService = async (query) => {
    try {
        const response = await axios.get(
            `${API_URL}/common/search?q=${query}`,
            { withCredentials: true }
        );

        return { ok: true, fetchMessage: true, data: response.data };
    }
    catch (err) {
        if (err.response) {
            return { ok: false, fetchMessage: true, data: err.response.data };
        }
        else {
            return { ok: false, fetchMessage: false, data: err.message }
        }
    }
};
