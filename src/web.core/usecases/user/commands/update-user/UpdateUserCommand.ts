import { GenderType } from '../../../../domain/enums/user/GenderType';

export class UpdateUserCommand {
    id: string;
    firstName: string;
    lastName: string | null;
    gender: GenderType | null;
    birthday: string | null;
    phone: string | null;
    address: string | null;
    culture: string | null;
    currency: string | null;
}
