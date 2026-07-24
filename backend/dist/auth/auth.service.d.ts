import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    private verifyOtp;
    private generateTokens;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
        expiresAt: Date;
        message: string;
        user: {
            id: string;
            phone: string;
            role: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
        expiresAt: Date;
        message: string;
        user: {
            id: string;
            phone: string;
            role: string;
        };
    }>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
        expiresAt: Date;
        message: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            phone: string;
            updatedAt: Date;
            clientId: string | null;
            providerId: string | null;
            role: string;
        };
        client: {
            name: string;
            id: string;
            createdAt: Date;
            phone: string;
            email: string | null;
            updatedAt: Date;
        } | null;
        provider: ({
            city: {
                name: string;
                id: string;
                createdAt: Date;
            };
        } & {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            phone: string;
            email: string | null;
            isAvailable: boolean;
            latitude: number | null;
            longitude: number | null;
            cityId: string;
            rating: number;
            reviews: number;
            updatedAt: Date;
        }) | null;
    }>;
}
