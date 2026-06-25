import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
interface JwtPayload {
    sub: number;
    role: string;
}
declare const JwtStrategy_base: new (...args: any[]) => InstanceType<typeof Strategy>;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): {
        id: number;
        role: string;
    };
}
export {};
