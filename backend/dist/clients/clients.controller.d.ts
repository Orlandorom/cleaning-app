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
        createdAt: Date;
        phone: string;
        email: string | null;
        updatedAt: Date;
    }>;
    findAll(query?: QueryClientDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        phone: string;
        email: string | null;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        phone: string;
        email: string | null;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateClientDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        phone: string;
        email: string | null;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        phone: string;
        email: string | null;
        updatedAt: Date;
    }>;
}
