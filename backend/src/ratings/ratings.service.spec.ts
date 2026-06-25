import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { Rating } from './entities/rating.entity';
import { Store } from '../stores/entities/store.entity';

describe('RatingsService', () => {
  let service: RatingsService;
  let mockRatingRepo: Record<string, jest.Mock>;
  let mockStoreRepo: Record<string, jest.Mock>;

  const mockStore = { id: 1, name: 'Test Store With Long Name!', ownerId: 2 };

  beforeEach(async () => {
    mockRatingRepo = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((entity) =>
        Promise.resolve({ id: 1, ...entity }),
      ),
    };

    mockStoreRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsService,
        { provide: getRepositoryToken(Rating), useValue: mockRatingRepo },
        { provide: getRepositoryToken(Store), useValue: mockStoreRepo },
      ],
    }).compile();

    service = module.get<RatingsService>(RatingsService);
  });

  it('should create a new rating if none exists', async () => {
    mockStoreRepo.findOne.mockResolvedValue(mockStore);
    mockRatingRepo.findOne.mockResolvedValue(null);

    const result = await service.upsertRating(1, 1, { rating: 4 });
    expect(result.rating).toBe(4);
    expect(mockRatingRepo.create).toHaveBeenCalled();
  });

  it('should update an existing rating', async () => {
    mockStoreRepo.findOne.mockResolvedValue(mockStore);
    mockRatingRepo.findOne.mockResolvedValue({
      id: 1,
      userId: 1,
      storeId: 1,
      rating: 3,
    });

    const result = await service.upsertRating(1, 1, { rating: 5 });
    expect(result.rating).toBe(5);
  });

  it('should throw NotFoundException if store does not exist', async () => {
    mockStoreRepo.findOne.mockResolvedValue(null);
    await expect(service.upsertRating(1, 999, { rating: 3 })).rejects.toThrow(
      NotFoundException,
    );
  });
});
