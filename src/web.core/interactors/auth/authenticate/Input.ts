export class AuthenticateInput {
    constructor(
        public token: string,
        public roleIds?: number[]
    ) {}
}
