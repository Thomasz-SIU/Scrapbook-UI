export interface Photo {
    id?: number;
    title: string;
    description: string;
    imageUrl: string;
    albumId: number;
    fileName: string;
    contentType: string;
    fileSize: number;
    uploadedAt: Date;
}
