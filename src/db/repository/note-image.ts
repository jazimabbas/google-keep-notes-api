import { NoteImage } from "../entities";
import dataSource from "../index";
import { Repository, In } from "typeorm";

type ImageOption = {
  imageUrl?: string;
  id?: string;
};

class NoteImageRepository {
  private repository: Repository<NoteImage>;

  constructor() {
    this.repository = dataSource.getRepository(NoteImage);
  }

  async findImage(args: ImageOption): Promise<NoteImage | undefined> {
    const where = {};

    if (args?.id) {
      where["id"] = args.id;
    } else {
      where["url"] = args.imageUrl;
    }

    const imageUrl = await this.repository.findOne(where);

    return imageUrl;
  }

  async getImages(imageUrls: string[]): Promise<NoteImage[]> {
    const images = await this.repository.find({
      where: { url: In(imageUrls) },
    });
    return images;
  }
}

export default NoteImageRepository;
