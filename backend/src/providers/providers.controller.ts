import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { QueryProvidersDto } from './dto/query-providers.dto';

@Controller('providers')
export class ProvidersController {
  constructor(private providersService: ProvidersService) {}

  @Get()
  async findAll(@Query() query: QueryProvidersDto) {
    return this.providersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.providersService.findById(id);
  }
}
