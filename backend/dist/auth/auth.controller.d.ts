import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    sendOtp(dto: LoginDto): Promise<{
        message: string;
    }>;
    verify(dto: VerifyOtpDto): Promise<{
        token: string;
        client: {
            id: string;
            name?: string;
            phone: string;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        token: string;
        client: {
            id: string;
            name: string;
            phone: string;
            email?: string;
        };
    }>;
    getProfile(user: any): Promise<any>;
}
