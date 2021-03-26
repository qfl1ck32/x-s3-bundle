export default /* GraphQL */ `
  type AppFile {
    _id: ID!
    name: String
    path: String!
    fullPath: String!
    size: Int!
    mimeType: String!
    resourceType: String
    resourceId: String
    userId: String
    user: User
    createdAt: Date
    updatedAt: Date
    createdBy: User
    updatedBy: User
  }
`;
