import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlsService } from './urls.service';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import Code from './utils/code';
import { JwtService } from '@nestjs/jwt';

jest.mock('./utils/code');

describe('UrlsService', () => {
  let service: UrlsService;
  let urlsRepository: jest.Mocked<Repository<Url>>;

  const createUrlDto: CreateUrlDto = {
    original_url: 'https://example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        JwtService,
        {
          provide: getRepositoryToken(Url),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    urlsRepository = module.get(getRepositoryToken(Url));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new record if the generated reference code does not exist in the database', async () => {
    (Code.generate as jest.Mock).mockReturnValue('ABC123');

    urlsRepository.findOneBy.mockResolvedValue(null);

    urlsRepository.save.mockResolvedValue({
      id: '1',
      reference_code: 'ABC123',
      ...createUrlDto,
    } as Url);

    const result = await service.create(createUrlDto);

    expect(Code.generate).toHaveBeenCalled();
    expect(urlsRepository.findOneBy).toHaveBeenCalledWith({
      reference_code: 'ABC123',
    });
    expect(urlsRepository.save).toHaveBeenCalledWith({
      ...createUrlDto,
      reference_code: 'ABC123',
    });
    expect(result).toEqual({
      id: '1',
      reference_code: 'ABC123',
      ...createUrlDto,
    });
  });

  it('should generate a new reference code if the first one already exists in the database', async () => {
    (Code.generate as jest.Mock)
      .mockReturnValueOnce('ABC123')
      .mockReturnValueOnce('XYZ789');

    urlsRepository.findOneBy
      .mockResolvedValueOnce({ reference_code: 'ABC123' } as Url)
      .mockResolvedValueOnce(null);

    urlsRepository.save.mockResolvedValue({
      id: '2',
      reference_code: 'XYZ789',
      ...createUrlDto,
    } as Url);

    const result = await service.create(createUrlDto);

    expect(Code.generate).toHaveBeenCalledTimes(2);

    expect(urlsRepository.findOneBy).toHaveBeenNthCalledWith(1, {
      reference_code: 'ABC123',
    });
    expect(urlsRepository.findOneBy).toHaveBeenNthCalledWith(2, {
      reference_code: 'XYZ789',
    });

    expect(urlsRepository.save).toHaveBeenCalledWith({
      ...createUrlDto,
      reference_code: 'XYZ789',
    });
    expect(result).toEqual({
      id: '2',
      reference_code: 'XYZ789',
      ...createUrlDto,
    });
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should throw an error if the repository fails during save', async () => {
    (Code.generate as jest.Mock).mockReturnValue('ERR123');

    urlsRepository.findOneBy.mockResolvedValue(null);

    urlsRepository.save.mockRejectedValue(new Error('Save error'));

    await expect(service.create(createUrlDto)).rejects.toThrow('Save error');

    expect(Code.generate).toHaveBeenCalled();
    expect(urlsRepository.findOneBy).toHaveBeenCalledWith({
      reference_code: 'ERR123',
    });
    expect(urlsRepository.save).toHaveBeenCalled();
  });
});
