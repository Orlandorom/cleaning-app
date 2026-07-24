export declare enum RegisterRole {
    CLIENT = "CLIENT",
    PROVIDER = "PROVIDER"
}
export declare class RegisterDto {
    phone: string;
    code: string;
    name: string;
    role: RegisterRole;
    email?: string;
    cityId?: string;
    description?: string;
}
