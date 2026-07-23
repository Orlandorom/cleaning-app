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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const providers_service_1 = require("./providers.service");
const create_provider_dto_1 = require("./dto/create-provider.dto");
const update_provider_dto_1 = require("./dto/update-provider.dto");
const query_provider_dto_1 = require("./dto/query-provider.dto");
let ProvidersController = class ProvidersController {
    constructor(providersService) {
        this.providersService = providersService;
    }
    create(dto) {
        return this.providersService.create(dto);
    }
    findAll(query) {
        return this.providersService.findAll(query);
    }
    findOne(id) {
        return this.providersService.findOne(id);
    }
    update(id, dto) {
        return this.providersService.update(id, dto);
    }
    remove(id) {
        return this.providersService.remove(id);
    }
};
exports.ProvidersController = ProvidersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Proveedor creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El teléfono ya está registrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_provider_dto_1.CreateProviderDto]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los proveedores' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de proveedores' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_provider_dto_1.QueryProviderDto]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un proveedor por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proveedor encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proveedor no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un proveedor' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proveedor actualizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proveedor no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El teléfono ya está en uso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_provider_dto_1.UpdateProviderDto]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un proveedor' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proveedor eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proveedor no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProvidersController.prototype, "remove", null);
exports.ProvidersController = ProvidersController = __decorate([
    (0, swagger_1.ApiTags)('Providers'),
    (0, common_1.Controller)('providers'),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService])
], ProvidersController);
//# sourceMappingURL=providers.controller.js.map