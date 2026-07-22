import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(user: any, dto: CreateBookingDto): Promise<{
        client: {
            id: string;
            phone: string;
            name: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        provider: {
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
        };
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
    }>;
    findAll(user: any): Promise<({
        provider: {
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
        };
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
    })[]>;
    findOne(id: string): Promise<{
        client: {
            id: string;
            phone: string;
            name: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        provider: {
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
        };
        service: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            type: import(".prisma/client").$Enums.ServiceType;
            price: number;
            duration: number;
        };
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
    }>;
    updateStatus(id: string, dto: UpdateBookingStatusDto): Promise<{
        client: {
            id: string;
            phone: string;
            name: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        provider: {
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
        };
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
    }>;
}
