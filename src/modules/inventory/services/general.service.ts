import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ProductInventory,
  WarehouseBranch,
  Warehouse,
  Branch,
  ProductRefill,
  RackZone,
  LevelZone,
  ProductRotation,
  Department,
  Municipality,
  District,
  TypeClient,
  EconomicActivity,
} from '../entities/index';
import { Product, ProductImages } from '../../sale/entities/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryHelperProvider } from '../providers/InventoryHelperProvider.provider';
import {
  CreateProductDto,
  CreateProductImageDto,
  CreateProductInventoryDto,
  UpdateProductDto,
  UpdateProductInventoryNewDto,
} from '../dto/product.dto';
import { InventoryDictionary } from '../dictionary/inventory.dictionary';

@Injectable()
export class GeneralService {
  constructor(
    @InjectRepository(TypeClient)
    private typeClientRepository: Repository<TypeClient>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Municipality)
    private municipalityRepository: Repository<Municipality>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(EconomicActivity)
    private economicActivityRepository: Repository<EconomicActivity>,
  ) { }

  async getAllDepartments() {
    return await this.departmentRepository.find();
  }
  async getAllMunicipalities() {
    return await this.municipalityRepository.find();
  }
  async getAllDistricts() {
    return await this.districtRepository.find();
  }

  async getMunicipalitiesByDepartment(departmentId: number) {
    const data = await this.municipalityRepository.find({
      where: {
        departmentId,
      },
    });
    if (!data.length) {
      throw new NotFoundException('Municipalities not found');
    }
    return data;
  }

  async getDistrictsByMunicipality(municipalityId: number) {
    const data = await this.districtRepository.find({
      where: {
        municipalityId,
      },
    });
    if (!data.length) {
      throw new NotFoundException('Districts not found');
    }
    return data;
  }

  async getAllTypeClient() {
    return await this.typeClientRepository.find();
  }

  async getAllEconomicActivity() {
    return await this.economicActivityRepository.find();
  }

}
