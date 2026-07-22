import { ProvidersService } from './providers.service';
import { QueryProvidersDto } from './dto/query-providers.dto';
export declare class ProvidersController {
    private providersService;
    constructor(providersService: ProvidersService);
    findAll(query: QueryProvidersDto): Promise<({
        services: ({
            service: {
                id: string;
                name: string;
                createdAt: Date;
                description: string | null;
                type: import(".prisma/client").$Enums.ServiceType;
                price: number;
                duration: number;
            };
        } & {
            providerId: string;
            serviceId: string;
        })[];
    } & {
        id: string;
        phone: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        rating: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
    })[]>;
    findOne(id: string): Promise<{
        bookings: ({
            review: {
                id: string;
                createdAt: Date;
                rating: number;
                bookingId: string;
                comment: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            providerId: string;
            serviceId: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            scheduledAt: Date;
            address: string;
            notes: string | null;
            totalPrice: number;
        })[];
        services: ({
            service: {
                id: string;
                name: string;
                createdAt: Date;
                description: string | null;
                type: import(".prisma/client").$Enums.ServiceType;
                price: number;
                duration: number;
            };
        } & {
            providerId: string;
            serviceId: string;
        })[];
    } & {
        id: string;
        phone: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        rating: number;
        isAvailable: boolean;
        latitude: number | null;
        longitude: number | null;
    }>;
}
