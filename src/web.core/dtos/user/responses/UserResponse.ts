import { Container } from 'typedi';
import { GenderType } from '../../../../constants/Enums';
import { IStorageService } from '../../../interfaces/gateways/medias/IStorageService';
import { RoleResponse } from '../../role/responses/RoleResponse';
import { User } from '../../../models/User';
const storageService = Container.get<IStorageService>('storage.service');

export class UserResponse {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    roleId: number;
    firstName: string;
    lastName?: string;
    fullName: string;
    email: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: string;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;

    role?: RoleResponse;

    constructor(model: User) {
        this.id = model.id;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
        this.roleId = model.roleId;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.fullName;
        this.email = model.email;
        this.avatar = model.avatar && storageService.mapUrl(model.avatar);
        this.gender = model.gender;
        this.birthday = model.birthday && `${model.birthday.getFullYear()}-${model.birthday.getMonth() + 1}-${model.birthday.getDate()}`;
        this.phone = model.phone;
        this.address = model.address;
        this.culture = model.culture;
        this.currency = model.currency;

        this.role = model.role && new RoleResponse(model.role);
    }
}
