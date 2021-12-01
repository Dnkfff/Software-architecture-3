import http  from '../common/http.js';

const Client = (baseUrl) => {

    const client = http(baseUrl)




    return {
        listMenu: () => client.get('/menu'),
        createOrder: (menuId, orderId) => client.post('/menu', { menuId: menuId, orderId: orderId })
    }

};

export { Client };