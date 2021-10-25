import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { IManager } from '@domain/interfaces/user/IManager';
import { UserBase } from './User';

export class Manager extends UserBase<IManager> implements IManager {
    get email(): string {
        return this.data.email;
    }

    set email(val: string) {
        this.data.email = val;
    }

    get status(): ManagerStatus {
        return this.data.status;
    }

    set status(val: ManagerStatus) {
        this.data.status = val;
    }

    get archivedAt(): Date | null {
        return this.data.archivedAt;
    }

    set archivedAt(val: Date | null) {
        this.data.archivedAt = val;
    }

    /* Relationship */

    /* Handlers */
}
