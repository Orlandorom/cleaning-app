import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateServiceDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
    }>;
    findAll(query?: QueryServiceDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
    }>;
}
