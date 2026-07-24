import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(dto: CreateServiceDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
    }>;
    findAll(query?: QueryServiceDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.ServiceType;
        duration: number;
    }>;
}
