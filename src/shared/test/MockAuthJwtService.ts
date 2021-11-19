import { IAuthJwtService } from 'application/interfaces/services/IAuthJwtService';
import { mockFunction } from './MockFunction';

export const mockAuthJwtService = (): IAuthJwtService => {
    return {
        getTokenFromHeader: mockFunction(),
        sign: mockFunction(),
        verify: mockFunction()
    };
};
