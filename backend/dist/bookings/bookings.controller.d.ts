import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: CreateBookingDto): Promise<{
        client: {
            id: string;
            phone: string;
            createdAt: Date;
            name: string;
            email: string | null;
            updatedAt: Date;
        };
        provider: {
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
        };
        service: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        clientId: string;
        providerId: string;
        serviceId: string;
    }>;
    findAll(query?: QueryBookingDto): Promise<({
        client: {
            id: string;
            phone: string;
            createdAt: Date;
            name: string;
            email: string | null;
            updatedAt: Date;
        };
        provider: {
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
        };
        service: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        clientId: string;
        providerId: string;
        serviceId: string;
    })[]>;
    findOne(id: string): Promise<{
        client: {
            id: string;
            phone: string;
            createdAt: Date;
            name: string;
            email: string | null;
            updatedAt: Date;
        };
        provider: {
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
        };
        service: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        clientId: string;
        providerId: string;
        serviceId: string;
    }>;
    update(id: string, dto: UpdateBookingDto): Promise<{
        client: {
            id: string;
            phone: string;
            createdAt: Date;
            name: string;
            email: string | null;
            updatedAt: Date;
        };
        provider: {
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
        };
        service: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        clientId: string;
        providerId: string;
        serviceId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        clientId: string;
        providerId: string;
        serviceId: string;
    }>;
}
