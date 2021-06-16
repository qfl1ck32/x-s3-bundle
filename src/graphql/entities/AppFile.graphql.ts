export default /* GraphQL */ `
  type AppFile {
    _id: ID!
    name: String
    path: String!
    downloadUrl: String!
    size: Int!
    mimeType: String!

    resourceType: String
    resourceId: String

    uploadedById: String
    uploadedBy: User

    createdAt: Date
    updatedAt: Date
  }
`;
