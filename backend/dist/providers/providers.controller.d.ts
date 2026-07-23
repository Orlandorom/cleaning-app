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
            createdAt: Date;
            name: string;
        };
    } & {
        id: string;
        phone: string;
        createdAt: Date;
        name: string;
        description: string | null;
        email: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
        updatedAt: Date;
    }>;
    findAll(query?: QueryProviderDto): Promise<({
        city: {
            id: string;
            createdAt: Date;
            name: string;
        };
    } & {
        id: string;
        phone: string;
        createdAt: Date;
        name: string;
        description: string | null;
        email: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        city: {
            id: string;
            createdAt: Date;
            name: string;
        };
    } & {
        id: string;
        phone: string;
        createdAt: Date;
        name: string;
        description: string | null;
        email: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateProviderDto): Promise<{
        city: {
            id: string;
            createdAt: Date;
            name: string;
        };
    } & {
        id: string;
        phone: string;
        createdAt: Date;
        name: string;
        description: string | null;
        email: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        name: string;
        description: string | null;
        email: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
        updatedAt: Date;
    }>;
}
