"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = exports.RegisterRole = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var RegisterRole;
(function (RegisterRole) {
    RegisterRole["CLIENT"] = "CLIENT";
    RegisterRole["PROVIDER"] = "PROVIDER";
})(RegisterRole || (exports.RegisterRole = RegisterRole = {}));
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+573001234567', description: 'Número de teléfono en formato internacional' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\+[1-9]\d{6,14}$/, { message: 'Debe ser un número válido en formato internacional (ej: +573001234567)' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456', description: 'Código OTP de 6 dígitos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Juan Pérez', description: 'Nombre del usuario', minLength: 2, maxLength: 100 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CLIENT', description: 'Rol del usuario', enum: RegisterRole }),
    (0, class_validator_1.IsEnum)(RegisterRole),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'juan@email.com', description: 'Correo electrónico' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-ciudad', description: 'ID de la ciudad (requerido para PROVIDER)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Profesional con 5 años de experiencia', description: 'Descripción del proveedor' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "description", void 0);
//# sourceMappingURL=register.dto.js.map