import { PrismaService } from '../prisma/prisma.service';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        price: number;
        duration: number;
    }[]>;
}
