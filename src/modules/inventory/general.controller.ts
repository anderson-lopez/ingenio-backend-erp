import { Controller, Get, Param } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GeneralService } from './services/general.service';

@ApiTags('General Catalogs')
@Controller('general')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) { }

  @Get('/departments')
  @ApiOperation({ summary: 'Get all departments' })
  async getDepartments() {
    return this.generalService.getAllDepartments();
  }

  @Get('/municipalities/:departmentId')
  @ApiOperation({ summary: 'Get all municipalities by department' })
  @ApiParam({ name: 'departmentId', type: Number })
  async getMunicipalitiesByDepartment(@Param('departmentId') departmentId: number) {
    return this.generalService.getMunicipalitiesByDepartment(departmentId);
  }

  @Get('/districts/:municipalityId')
  @ApiOperation({ summary: 'Get all districts by municipality' })
  @ApiParam({ name: 'municipalityId', type: Number })
  async getDistrictsByMunicipality(@Param('municipalityId') municipalityId: number) {
    return this.generalService.getDistrictsByMunicipality(municipalityId);
  }

  @Get('/type-client')
  @ApiOperation({ summary: 'Get all type clients' })
  async getAllTypeClient() {
    return this.generalService.getAllTypeClient();
  }

  @Get('/economic-activity')
  @ApiOperation({ summary: 'Get all economic activities' })
  async getAllEconomicActivity() {
    return this.generalService.getAllEconomicActivity();
  }

}
