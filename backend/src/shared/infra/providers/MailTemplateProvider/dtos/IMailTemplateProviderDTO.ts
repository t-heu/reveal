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
