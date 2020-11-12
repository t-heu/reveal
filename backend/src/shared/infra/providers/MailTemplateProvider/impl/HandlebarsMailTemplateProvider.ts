import handlebars from 'handlebars';
import fs from 'fs';

import {
  IMailTemplateProvider,
  IParseMailTemplateDTO,
} from '../dtos/IMailTemplateProviderDTO';

export default class HandlebarsMailTemplateProvider
  implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);
    return parseTemplate(variables);
  }
}
