import { GenderType } from '../../../domain/enums/GenderType';
import { User } from '../../../domain/entities/User';

export class FindContactOutput {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: string;
    phone?: string;
    address?: string;

    constructor(data: User) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.avatar = data.avatar;
        this.gender = data.gender;
        this.birthday = data.birthdayDisplay;
        this.phone = data.phone;
        this.address = data.address;
    }
}
