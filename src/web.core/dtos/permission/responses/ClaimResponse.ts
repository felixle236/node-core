import { ClaimItem } from './ClaimItem';

export class ClaimResponse {
    name: string;
    items: ClaimItem[];

    constructor(name: string) {
        this.name = name;
        this.items = [];
    }
}
