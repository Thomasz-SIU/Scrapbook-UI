export interface Album {
    id?: number;
    title: string;
    description: string;
    createdAt: Date;
    photos?: Photo[];
}
