// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { StoresService } from '../stores/stores.service';
import { RatingsService } from '../ratings/ratings.service';
import { Role } from '../common/enums/role.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

async function bootstrap() {
  console.log('Seeding database...');
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const storesService = app.get(StoresService);
  const ratingsService = app.get(RatingsService);
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

  // 1. Create Admin
  let admin = await userRepo.findOne({ where: { email: 'admin@storerating.com' } });
  if (!admin) {
    admin = await usersService.create({
      name: 'System Administrator',
      email: 'admin@storerating.com',
      password: 'Password@123',
      address: '123 Admin St, Tech City',
      role: Role.ADMIN,
    });
    console.log('Created Admin:', admin.email);
  }

  // 2. Create Store Owners
  const ownerData = [
    { name: 'Miuccia Prada', email: 'owner.prada@storerating.com', address: 'Milan, Italy' },
    { name: 'Tim Cook', email: 'owner.apple@storerating.com', address: 'Cupertino, CA' },
    { name: 'Phil Knight', email: 'owner.nike@storerating.com', address: 'Beaverton, OR' },
    { name: 'Marco Bizzarri', email: 'owner.gucci@storerating.com', address: 'Florence, Italy' },
    { name: 'Bernard Arnault', email: 'owner.louisvuitton@storerating.com', address: 'Paris, France' },
    { name: 'Jean-Frédéric Dufour', email: 'owner.rolex@storerating.com', address: 'Geneva, Switzerland' },
    { name: 'Kenichiro Yoshida', email: 'owner.sony@storerating.com', address: 'Tokyo, Japan' },
  ];
  const owners = [];
  for (const data of ownerData) {
    let owner = await userRepo.findOne({ where: { email: data.email } });
    if (!owner) {
      owner = await usersService.create({
        name: data.name,
        email: data.email,
        password: 'Password@123',
        address: data.address,
        role: Role.STORE_OWNER,
      });
      console.log('Created Store Owner:', owner.email);
    }
    owners.push(owner);
  }

  // 3. Create Normal Users
  const userData = [
    { name: 'John Doe', email: 'john.doe@storerating.com' },
    { name: 'Alice Smith', email: 'alice.smith@storerating.com' },
    { name: 'Robert Johnson', email: 'robert.j@storerating.com' },
    { name: 'Emily Davis', email: 'emily.d@storerating.com' },
    { name: 'Michael Brown', email: 'michael.b@storerating.com' },
    { name: 'Sarah Wilson', email: 'sarah.w@storerating.com' },
    { name: 'David Lee', email: 'david.l@storerating.com' },
    { name: 'Laura Martinez', email: 'laura.m@storerating.com' },
    { name: 'James Anderson', email: 'james.a@storerating.com' },
    { name: 'Olivia Taylor', email: 'olivia.t@storerating.com' },
    { name: 'Daniel Thomas', email: 'daniel.t@storerating.com' },
    { name: 'Jessica Jackson', email: 'jessica.j@storerating.com' },
    { name: 'Matthew White', email: 'matthew.w@storerating.com' },
    { name: 'Karen Harris', email: 'karen.h@storerating.com' },
    { name: 'Anthony Martin', email: 'anthony.m@storerating.com' },
    { name: 'Nancy Thompson', email: 'nancy.t@storerating.com' },
    { name: 'Mark Garcia', email: 'mark.g@storerating.com' },
    { name: 'Lisa Martinez', email: 'lisa.m@storerating.com' },
    { name: 'Paul Robinson', email: 'paul.r@storerating.com' },
    { name: 'Betty Clark', email: 'betty.c@storerating.com' }
  ];
  const users = [];
  for (let i = 0; i < userData.length; i++) {
    const data = userData[i];
    let user = await userRepo.findOne({ where: { email: data.email } });
    if (!user) {
      user = await usersService.create({
        name: data.name,
        email: data.email,
        password: 'Password@123',
        address: `${i + 1}5 Residential Ave, Suburbia`,
        role: Role.NORMAL_USER,
      });
      console.log('Created Normal User:', user.email);
    }
    users.push(user);
  }

  // 4. Create Stores
  const storeNames = ['Prada', 'Apple Store', 'Nike', 'Gucci', 'Louis Vuitton', 'Rolex', 'Sony'];
  const stores = [];
  for (let i = 0; i < storeNames.length; i++) {
    const storesAdmin = await storesService.findAllAdmin({});
    let storeInfo = storesAdmin.find(s => s.name === storeNames[i]);
    
    let store;
    if (!storeInfo) {
      store = await storesService.create({
        name: storeNames[i],
        email: `contact@${storeNames[i].replace(/\s+/g, '').toLowerCase()}.com`,
        address: `${i + 1} Main Street, Global Avenue`,
        ownerId: owners[i].id,
      });
      console.log('Created Store:', store.name);
    } else {
      store = { id: storeInfo.id, name: storeInfo.name };
    }
    stores.push(store);
  }

  // 5. Create Ratings
  console.log('Creating Ratings...');
  for (const store of stores) {
    for (const user of users) {
      // 80% chance to rate a store
      if (Math.random() < 0.8) {
        // Weighted random rating (more likely to be 3-5, but 1-2 possible)
        const rand = Math.random();
        let ratingValue = 5;
        if (rand < 0.1) ratingValue = 1;
        else if (rand < 0.25) ratingValue = 2;
        else if (rand < 0.5) ratingValue = 3;
        else if (rand < 0.75) ratingValue = 4;
        
        try {
          await ratingsService.upsertRating(user.id, store.id, { rating: ratingValue });
        } catch (e) {
          // Ignore if already rated or error
        }
      }
    }
  }

  console.log('Database Seeding Completed!');
  await app.close();
}

bootstrap();
