import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(dto: CreateServiceDto): Promise<{
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        name: string;
        id: string;
        createdAt: Date;
        duration: number;
    }>;
    findAll(query?: QueryServiceDto): Promise<{
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        name: string;
        id: string;
        createdAt: Date;
        duration: number;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        name: string;
        id: string;
        createdAt: Date;
        duration: number;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        name: string;
        id: string;
        createdAt: Date;
        duration: number;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        name: string;
        id: string;
        createdAt: Date;
        duration: number;
    }>;
}
