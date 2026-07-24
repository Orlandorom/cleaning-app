import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(dto: CreateClientDto): Promise<{
        name: string;
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
    }>;
    findAll(query?: QueryClientDto): Promise<{
        name: string;
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
    }>;
    update(id: string, dto: UpdateClientDto): Promise<{
        name: string;
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
    }>;
}
