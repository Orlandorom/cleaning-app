import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { QueryProviderDto } from './dto/query-provider.dto';
export declare class ProvidersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProviderDto): Promise<{
        city: {
            name: string;
            id: string;
            createdAt: Date;
        };
    } & {
        name: string;
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        description: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
    }>;
    findAll(query?: QueryProviderDto): Promise<({
        city: {
            name: string;
            id: string;
            createdAt: Date;
        };
    } & {
        name: string;
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        description: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
    })[]>;
    findOne(id: string): Promise<{
        city: {
            name: string;
            id: string;
            createdAt: Date;
        };
    } & {
        name: string;
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        description: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
    }>;
    update(id: string, dto: UpdateProviderDto): Promise<{
        city: {
            name: string;
            id: string;
            createdAt: Date;
        };
    } & {
        name: string;
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        description: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        description: string | null;
        rating: number;
        reviews: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
        cityId: string;
    }>;
}
