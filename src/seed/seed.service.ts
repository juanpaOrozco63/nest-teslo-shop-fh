import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService:ProductsService,
    @InjectRepository(User)
    private readonly userRepository:Repository<User>
  ){ }

  async runSeed() {
    this.deleteTables();
    const adminUser = await this.insertUser();
    this.insertNewProducts(adminUser);
    return 'This action adds a new seed';
  }

  private async insertUser(){
    const seedUsers = initialData.users;
    const users:User[]=[]
    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    }); 
    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers[0]    
  }
  private async insertNewProducts(user:User){
    await this.productService.deleteAllProducts();
    const seedProducts = initialData.products;
    const insertPromieses = [];
    seedProducts.forEach(product => {
      insertPromieses.push(this.productService.create(product,user));
    });
    await Promise.all(insertPromieses);
  }

  private async deleteTables(){
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }
}
