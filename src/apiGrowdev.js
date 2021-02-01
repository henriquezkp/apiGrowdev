import axios from 'axios';

/*const apiGrowdev = axios.create({
    baseURL: 'https://growdev-test-node.herokuapp.com'
});*/

class apiGrowdev {
    constructor() {
        this.baseURL = 'https://growdev-test-node.herokuapp.com';
    }


    //users
    get(url) {
        const api = axios.create({
            baseURL: this.baseURL
        });

        return api.get(url);
    }

    //users
    getAutenticado(url, token) {
        const api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
        });

        return api.get(url);
    }


    //login, {username: "henrique", password: "12345"}
    post(url, dados) {
        const api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
        });

        return api.post(url, dados);
    }

    postAutenticado(url, dados) {
        const api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        return api.post(url, dados);
    }
}


export default new apiGrowdev();