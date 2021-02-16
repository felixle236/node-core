export class GetListOnlineStatusByIdsQueryResult {
    constructor(
        public id: string,
        public isOnline: boolean,
        public onlineAt: Date | null
    ) {}
}
