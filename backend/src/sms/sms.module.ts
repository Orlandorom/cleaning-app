import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { OtpService } from './otp.service';

@Module({
  controllers: [SmsController],
  providers: [OtpService],
})
export class SmsModule {}
