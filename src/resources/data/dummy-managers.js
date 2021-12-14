const path = require('path');

exports.managers = [{
    firstName: 'Product',
    lastName: 'Owner',
    email: 'product.owner@localhost.com',
    password: 'Nodecore@2',
    avatar: path.join(__dirname, '../images/docker.png')
}, {
    firstName: 'Product',
    lastName: 'Manager',
    email: 'product.manager@localhost.com',
    password: 'Nodecore@2',
    avatar: path.join(__dirname, '../images/golang.png')
}];
