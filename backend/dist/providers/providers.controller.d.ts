import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { QueryProviderDto } from './dto/query-provider.dto';
export declare class ProvidersController {
    private readonly providersService;
    constructor(providersService: ProvidersService);
    create(dto: CreateProviderDto): Promise<{
        city: {
            id: string;
            name: string;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        phone: string;
        email: string | null;
        description: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        cityId: string;
    }>;
    findAll(query?: QueryProviderDto): Promise<({
        city: {
            id: string;
            name: string;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        phone: string;
        email: string | null;
        description: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        cityId: string;
    })[]>;
    findOne(id: string): Promise<{
        city: {
            id: string;
            name: string;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        phone: string;
        email: string | null;
        description: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        cityId: string;
    }>;
    update(id: string, dto: UpdateProviderDto): Promise<{
        city: {
            id: string;
            name: string;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        phone: string;
        email: string | null;
        description: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        cityId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        description: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        cityId: string;
    }>;
}
