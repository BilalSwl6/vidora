from typing import Any, Dict
import os
from google.cloud import storage

class CloudService:
    def __init__(self):
        self.client = storage.Client()
        self.bucket_name = os.getenv("CLOUD_STORAGE_BUCKET")

    def upload_file(self, file_path: str, destination_blob_name: str) -> None:
        bucket = self.client.bucket(self.bucket_name)
        blob = bucket.blob(destination_blob_name)
        blob.upload_from_filename(file_path)

    def download_file(self, source_blob_name: str, destination_file_path: str) -> None:
        bucket = self.client.bucket(self.bucket_name)
        blob = bucket.blob(source_blob_name)
        blob.download_to_filename(destination_file_path)

    def list_files(self) -> Dict[str, Any]:
        bucket = self.client.bucket(self.bucket_name)
        blobs = bucket.list_blobs()
        return {blob.name: blob.public_url for blob in blobs}