import { Container } from 'typedi';
import { GenderType } from '../../../../constants/Enums';
import { IStorageService } from '../../../interfaces/gateways/medias/IStorageService';
import { User } from '../../../models/User';
const storageService = Container.get<IStorageService>('storage.service');

export class MemberResponse {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
    isOnline: boolean;
    hasNewMessage: boolean;

    constructor(model: User) {
        this.id = model.id;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.email = model.email;
        this.avatar = model.avatar;
        this.gender = model.gender;
        this.birthday = model.birthday;
        this.phone = model.phone;
        this.address = model.address;
        this.culture = model.culture;
        this.currency = model.currency;
        this.isOnline = false;
        this.hasNewMessage = false;
    }
}
