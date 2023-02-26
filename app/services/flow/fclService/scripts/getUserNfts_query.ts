export const getAllUserNfts_query = `

import MetadataViews from 0x631e88ae7f1d7c20
import NFTCatalog from 0x324c34e1c517e4db
import NFTRetrieval from 0x324c34e1c517e4db


pub struct NFT {
    pub let id: UInt64
    pub let uuid: String
    pub let name: String
    pub let description: String
    pub let thumbnail: String
    pub let externalURL: String
    pub let collectionIdentifier: String
    pub let collectionName: String
    pub let collectionDescription: String
    pub let collectionSquareImage: String
    pub let collectionBannerImage: String

    init(
        id: UInt64,
        uuid: String,
        name: String,
        description: String,
        thumbnail: String,
        externalURL: String,
        collectionIdentifier: String,
        collectionName: String,
        collectionDescription: String,
        collectionSquareImage: String,
        collectionBannerImage: String,
    ) {
        self.id = id
        self.uuid = uuid
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.externalURL = externalURL
        self.collectionIdentifier = collectionIdentifier
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
    }
}

pub fun main(ownerAddresses: [Address]): {String: [NFT]} {
  
    let data: {String: [NFT]} = {}
  
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

        let items: [NFT] = []

        for view in views {
            let displayView = view.display
            let externalURLView = view.externalURL
            let collectionDataView = view.collectionData
            let collectionDisplayView = view.collectionDisplay

            if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil) {
                // This NFT does not have the proper views implemented. Skipping....
                continue
            }

            items.append(
                NFT(
                    id: view.id,
                    uuid: view.uuid.toString(),
                    name: displayView!.name,
                    description: displayView!.description,
                    thumbnail: displayView!.thumbnail.uri(),
                    externalURL: externalURLView!.url,
                    collectionIdentifier: key,
                    collectionName: collectionDisplayView!.name,
                    collectionDescription: collectionDisplayView!.description,
                    collectionSquareImage: collectionDisplayView!.squareImage.file.uri(),
                    collectionBannerImage: collectionDisplayView!.bannerImage.file.uri(),
                )
            )
        }

        data[key] = items
    }
  }
    return data

}

`