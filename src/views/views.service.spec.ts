import { Test, TestingModule } from '@nestjs/testing';
import { ViewsService } from './views.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { View } from './entities/view.entity';
import { Repository } from 'typeorm';
import { CreateViewDto } from './dto/create-view.dto';

describe('ViewsService', () => {
  let service: ViewsService;
  let repository: Repository<View>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViewsService,
        {
          provide: getRepositoryToken(View),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ViewsService>(ViewsService);
    repository = module.get<Repository<View>>(getRepositoryToken(View));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.save with the DTO and return the saved record', async () => {
      const createViewDto: CreateViewDto = {
        url_id: 'test-url-id',
      };

      const savedView = {
        id: 1,
        ...createViewDto,
      };

      (repository.save as jest.Mock).mockResolvedValue(savedView);

      const result = await service.create(createViewDto);

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(createViewDto);
      expect(result).toEqual(savedView);
    });

    it('should propagate any error thrown by repository.save', async () => {
      const createViewDto: CreateViewDto = {
        url_id: 'error-url-id',
      };

      (repository.save as jest.Mock).mockRejectedValue(
        new Error('Error saving to the database'),
      );

      await expect(service.create(createViewDto)).rejects.toThrow(
        'Error saving to the database',
      );
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(createViewDto);
    });
  });
});
