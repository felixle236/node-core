import { ValueObject } from 'domain/common/ValueObject';

export class AddressInfo extends ValueObject {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}
