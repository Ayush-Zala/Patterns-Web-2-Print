const fs = require('fs');
const txt = `
// -----------------------------------------------------------------------------
// PRODUCT MODULE
// -----------------------------------------------------------------------------

enum ProductStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Product {
  id          String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  workspaceId String        @map("workspace_id") @db.Uuid
  title       String
  description String?
  price       Int           // Price in cents
  imageUrl    String?       @map("image_url")
  status      ProductStatus @default(DRAFT)
  
  // Audit
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")
  deletedAt   DateTime?     @map("deleted_at")
  version     Int           @default(1)

  @@map("products")
}
`;
fs.appendFileSync('packages/prisma/prisma/schema.prisma', txt, 'utf8');
