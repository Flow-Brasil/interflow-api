export const check_initialized_wallet = `import NonFungibleToken from 0x631e88ae7f1d7c20\nimport MetadataViews from 0x631e88ae7f1d7c20\nimport InterflowCustom from 0xfe514356a985ec2a\npub fun main(address: Address): Bool { \n let hasCollection = getAccount(address).getCapability<&InterflowCustom.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(InterflowCustom.CollectionPublicPath).check() \n return hasCollection ? true : false \n}`