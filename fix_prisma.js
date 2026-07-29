const fs = require('fs');
let content = fs.readFileSync('packages/prisma/prisma/schema.prisma', 'utf8');
const marker =
  '// -----------------------------------------------------------------------------\n// PRODUCT MODULE';
if (content.indexOf(marker) !== -1) {
  content = content.slice(0, content.indexOf(marker));
}
content += `
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
fs.writeFileSync('packages/prisma/prisma/schema.prisma', content);
