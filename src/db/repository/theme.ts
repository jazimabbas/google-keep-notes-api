import { Repository } from "typeorm";
import { Theme } from "../entities";
import dataSource from "../index";

type FindThemeOption = {
  id?: string;
  color?: string;
};

class ThemeRepository {
  private repository: Repository<Theme>;

  constructor() {
    this.repository = dataSource.getRepository(Theme);
  }

  async getTheme(args: FindThemeOption): Promise<Theme | undefined> {
    const where = {};

    if (args?.id) {
      where["id"] = args.id;
    } else {
      where["color"] = args.color;
    }

    const theme = await this.repository.findOneBy(where);

    return theme;
  }

  async createTheme(color: string): Promise<void> {
    const isExist = await this.getTheme({ color });

    //Achieve idempotency
    if (!isExist) {
      const newTheme = this.repository.create({ color });
      await this.repository.save(newTheme);
    }
  }
}

export default ThemeRepository;
