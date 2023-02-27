export interface UserUpdate {
    expoToken: string;
    nickname: string;
    bloctoAddress: string;
    dapperAddress: string;
    nftLength?: number;
    bgImage: string;
    pfpImage: string;
    nftCollections?: string[];
}