import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private twilioClient;
    constructor(prisma: PrismaService, jwtService: JwtService);
    sendOtp(phone: string): Promise<void>;
    verifyOtp(phone: string, code: string): Promise<{
        token: string;
        client: {
            id: string;
            name?: string;
            phone: string;
        };
    }>;
    register(data: {
        name: string;
        phone: string;
        email?: string;
    }): Promise<{
        token: string;
        client: {
            id: string;
            name: string;
            phone: string;
            email?: string;
        };
    }>;
}
