export interface IGenerateLink {
  generateDynamicLink: (url: string) => Promise<string>;
}
