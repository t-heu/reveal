export interface Mapper<T> {
  toDTO(t: T): any;
  toDomain(raw: any): T;
  toPersistence(t: T): any;
}
