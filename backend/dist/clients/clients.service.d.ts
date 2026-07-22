import { PrismaService } from '../prisma/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientsService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        bookings: {
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
        }[];
    } & {
        id: string;
        phone: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateClientDto): Promise<{
        id: string;
        phone: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
