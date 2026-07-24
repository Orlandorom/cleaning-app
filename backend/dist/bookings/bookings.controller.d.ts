import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: CreateBookingDto): Promise<{
        client: {
            name: string;
            id: string;
            createdAt: Date;
            phone: string;
            email: string | null;
            updatedAt: Date;
        };
        provider: {
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
        };
        service: {
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            name: string;
            id: string;
            createdAt: Date;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        providerId: string;
        serviceId: string;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
    }>;
    findAll(query?: QueryBookingDto): Promise<({
        client: {
            name: string;
            id: string;
            createdAt: Date;
            phone: string;
            email: string | null;
            updatedAt: Date;
        };
        provider: {
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
        };
        service: {
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            name: string;
            id: string;
            createdAt: Date;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        providerId: string;
        serviceId: string;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
    })[]>;
    findOne(id: string): Promise<{
        client: {
            name: string;
            id: string;
            createdAt: Date;
            phone: string;
            email: string | null;
            updatedAt: Date;
        };
        provider: {
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
        };
        service: {
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            name: string;
            id: string;
            createdAt: Date;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        providerId: string;
        serviceId: string;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
    }>;
    update(id: string, dto: UpdateBookingDto): Promise<{
        client: {
            name: string;
            id: string;
            createdAt: Date;
            phone: string;
            email: string | null;
            updatedAt: Date;
        };
        provider: {
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
        };
        service: {
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            name: string;
            id: string;
            createdAt: Date;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        providerId: string;
        serviceId: string;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        providerId: string;
        serviceId: string;
        scheduledAt: Date;
        address: string;
        notes: string | null;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
    }>;
}
