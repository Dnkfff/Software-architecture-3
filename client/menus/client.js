const http = import('../common/http.js');

const Client = (baseUrl) => {

    const client = http.then((result) => result.baseUrl);

    return {
        listMenu: () => client.get('/menu_list'),
        createOrder: (menuId, orderId) => client.post('/make_order', { menuId: menuId, orderId: orderId })
    }

};

export { Client };