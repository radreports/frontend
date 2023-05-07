import axios from 'axios';

export class StudiesService {

    getStudies() {
        console.log(axios.get('http://api.deepmd.io/studies'));
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
    }
    getProductsSmall() {
       
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
    }

    getProducts() {
        
        return axios.get('assets/demo/data/products.json').then(res => res.data.data);
    }

    getProductsWithOrdersSmall() {
        
        return axios.get('assets/demo/data/products-orders-small.json').then(res => res.data.data);
    }
}