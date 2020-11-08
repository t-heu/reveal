import handlebars from 'handlebars';
import fs from 'fs';

interface ITemplateVariables {
  [key: string]: string | number;
}

export interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}

export interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}

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
