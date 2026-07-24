import { api } from './api';

export interface SendOtpDto {
  phone: string;
}

export interface VerifyOtpDto {
  phone: string;
  code: string;
}

export const smsService = {
  sendOtp(dto: SendOtpDto) {
    return api.post<{ message: string }>('/sms/otp/send', dto);
  },

  verifyOtp(dto: VerifyOtpDto) {
    return api.post<{ message: string }>('/sms/otp/verify', dto);
  },
};
