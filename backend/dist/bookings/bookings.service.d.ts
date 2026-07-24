import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
export declare class BookingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateBookingDto): Promise<{
        client: {
            name: string;
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
        };
        provider: {
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
        };
        service: {
            name: string;
            id: string;
            createdAt: Date;
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            duration: number;
        };
    } & {
        id: string;
        clientId: string;
        providerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        serviceId: string;
    }>;
    findAll(query?: QueryBookingDto): Promise<({
        client: {
            name: string;
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
        };
        provider: {
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
        };
        service: {
            name: string;
            id: string;
            createdAt: Date;
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            duration: number;
        };
    } & {
        id: string;
        clientId: string;
        providerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        serviceId: string;
    })[]>;
    findOne(id: string): Promise<{
        client: {
            name: string;
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
        };
        provider: {
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
        };
        service: {
            name: string;
            id: string;
            createdAt: Date;
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            duration: number;
        };
    } & {
        id: string;
        clientId: string;
        providerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        serviceId: string;
    }>;
    update(id: string, dto: UpdateBookingDto): Promise<{
        client: {
            name: string;
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
        };
        provider: {
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
        };
        service: {
            name: string;
            id: string;
            createdAt: Date;
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            duration: number;
        };
    } & {
        id: string;
        clientId: string;
        providerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        serviceId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        clientId: string;
        providerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        serviceId: string;
    }>;
}
