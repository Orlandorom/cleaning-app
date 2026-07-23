import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(dto: CreateClientDto): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        name: string;
        email: string | null;
        updatedAt: Date;
    }>;
    findAll(query?: QueryClientDto): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        name: string;
        email: string | null;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        name: string;
        email: string | null;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateClientDto): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        name: string;
        email: string | null;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        name: string;
        email: string | null;
        updatedAt: Date;
    }>;
}
