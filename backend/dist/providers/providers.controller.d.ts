import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { QueryProviderDto } from './dto/query-provider.dto';
export declare class ProvidersController {
    private readonly providersService;
    constructor(providersService: ProvidersService);
    create(dto: CreateProviderDto): Promise<{
        city: {
            name: string;
            id: string;
            createdAt: Date;
        };
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        phone: string;
        email: string | null;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
        rating: number;
        reviews: number;
        updatedAt: Date;
    }>;
    findAll(query?: QueryProviderDto): Promise<({
        city: {
            name: string;
            id: string;
            createdAt: Date;
        };
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        phone: string;
        email: string | null;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
        rating: number;
        reviews: number;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        city: {
            name: string;
            id: string;
            createdAt: Date;
        };
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        phone: string;
        email: string | null;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
        rating: number;
        reviews: number;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateProviderDto): Promise<{
        city: {
            name: string;
            id: string;
            createdAt: Date;
        };
    } & {
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        phone: string;
        email: string | null;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
        rating: number;
        reviews: number;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        phone: string;
        email: string | null;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
        rating: number;
        reviews: number;
        updatedAt: Date;
    }>;
}
