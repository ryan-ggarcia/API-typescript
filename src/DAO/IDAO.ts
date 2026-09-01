export interface IDAO<type>{
    Create(entity: type): Promise<number>;
    Read(id: number): Promise<type | false> ;
    Update(entity: type): Promise<boolean> ;
    Delete(id: number): Promise<boolean> ;
    List(): Promise<type[]> ;
}