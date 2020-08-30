import * as path from 'path';

module.exports = [{
    roleId: '80d81a05-649a-4a53-a896-ad978c2f501e',
    firstName: 'Product',
    lastName: 'Owner',
    email: 'product.owner@localhost.com',
    password: 'Nodecore@2',
    gender: 'male',
    avatar: path.join(__dirname, '../images/docker.png')
}, {
    roleId: '80d81a05-649a-4a53-a896-ad978c2f501e',
    firstName: 'Product',
    lastName: 'Manager',
    email: 'product.manager@localhost.com',
    password: 'Nodecore@2',
    gender: 'female',
    avatar: path.join(__dirname, '../images/golang.png')
}];
