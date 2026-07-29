export interface StorageMetadata {
  size: number;
  mimeType: string;
  updatedAt: Date;
}

export interface StorageProvider {
  /**
   * Uploads a file to the storage provider.
   */
  upload(
    bucket: string,
    path: string,
    data: Buffer | Uint8Array,
    mimeType?: string,
  ): Promise<string>;

  /**
   * Downloads a file from the storage provider.
   */
  download(bucket: string, path: string): Promise<Buffer>;

  /**
   * Deletes a file from the storage provider.
   */
  delete(bucket: string, path: string): Promise<boolean>;

  /**
   * Checks if a file exists.
   */
  exists(bucket: string, path: string): Promise<boolean>;

  /**
   * Copies a file from one path to another.
   */
  copy(bucket: string, sourcePath: string, destinationPath: string): Promise<void>;

  /**
   * Moves (renames) a file from one path to another.
   */
  move(bucket: string, sourcePath: string, destinationPath: string): Promise<void>;

  /**
   * Generates a pre-signed URL for temporary access to a file.
   */
  generateSignedUrl(bucket: string, path: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Lists files in a given bucket and prefix path.
   */
  list(bucket: string, prefix?: string): Promise<string[]>;

  /**
   * Retrieves metadata for a specific file.
   */
  metadata(bucket: string, path: string): Promise<StorageMetadata>;
}
