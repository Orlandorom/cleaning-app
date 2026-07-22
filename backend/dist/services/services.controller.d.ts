import { ServicesService } from './services.service';
export declare class ServicesController {
    private servicesService;
    constructor(servicesService: ServicesService);
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
