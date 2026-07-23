import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateServiceDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
        createdAt: Date;
    }>;
    findAll(query?: QueryServiceDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
        createdAt: Date;
    }>;
}
