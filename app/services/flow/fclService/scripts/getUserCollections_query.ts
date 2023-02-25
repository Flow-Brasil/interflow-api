export const getUserCollections_query = `
import MetadataViews from 0x631e88ae7f1d7c20
import NFTCatalog from 0x324c34e1c517e4db
import NFTRetrieval from 0x324c34e1c517e4db

pub struct NFT {
    pub let nftLength: Int
    pub let collectionIdentifier: String
    pub let collectionName: String
    pub let collectionDescription: String
    pub let collectionSquareImage: String
    pub let collectionBannerImage: String

    init(
        nftLength: Int,
        collectionIdentifier: String,
        collectionName: String,
        collectionDescription: String,
        collectionSquareImage: String,
        collectionBannerImage: String,
    ) {
        self.nftLength = nftLength
        self.collectionIdentifier = collectionIdentifier
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
    }
}

pub fun main(ownerAddresses: [Address]): {String: NFT} {
  
    let data: {String: NFT} = {}
  
  for ownerAddress in ownerAddresses {
    
    if !(getAccount(ownerAddress).balance > 0.00) {
        continue
    } 

    let catalog = NFTCatalog.getCatalog()
    let account = getAuthAccount(ownerAddress)
    let items: [NFTRetrieval.BaseNFTViewsV1] = []

    for key in catalog.keys {
        let value = catalog[key]!
        let keyHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(key.utf8))
        let tempPathStr = "catalog".concat(keyHash)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!

        account.link<&{MetadataViews.ResolverCollection}>(
            tempPublicPath,
            target: value.collectionData.storagePath
        )

        let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
        if !collectionCap.check() {
            continue
        }
        

        let views = NFTRetrieval.getNFTViewsFromCap(collectionIdentifier: key, collectionCap: collectionCap)
        for view in views {
            let displayView = view.display
            let externalURLView = view.externalURL
            let collectionDataView = view.collectionData
            let collectionDisplayView = view.collectionDisplay
            let royaltyView = view.royalties

            if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil || royaltyView == nil) {
                // This NFT does not have the proper views implemented. Skipping....
                continue
            } else {

                let item = NFT(
                nftLength: views.length,
                collectionIdentifier: key,
                collectionName: view.display!.name,
                collectionDescription: view.display!.description,
                collectionSquareImage: view.collectionDisplay!.squareImage.file.uri(),
                collectionBannerImage: view.collectionDisplay!.bannerImage.file.uri(),
                )

                data[key] = item
                break
            }
        }
        }
    }
    return data
}

`