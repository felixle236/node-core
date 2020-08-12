import { Container } from 'typedi';
import { IStorageService } from '../../../interfaces/gateways/medias/IStorageService';
import { User } from '../../../models/User';
const storageService = Container.get<IStorageService>('storage.service');

export class UserCommonResponse {
    id: number;
    firstName: string;
    lastName?: string;
    fullName: string;
    email: string;
    avatar?: string;

    constructor(model: User) {
        this.id = model.id;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.fullName;
        this.email = model.email;
        this.avatar = model.avatar;
    }
}
