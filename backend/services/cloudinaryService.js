import { v2 as cloudinary } from 'cloudinary';

class CloudinaryService {
  constructor() {
    this.initialized = false;
  }

  initialize() {
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.warn('⚠️  Cloudinary credentials not found. Image upload will be disabled.');
      return;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      timeout: 60000
    });

    this.initialized = true;
    console.log('✅ Cloudinary service initialized');
  }

  async uploadImage(imageBuffer, folder = 'pawmitra') {
    if (!this.initialized) {
      // Return mock URL for development
      return {
        url: 'https://via.placeholder.com/800x600?text=Image+Upload+Disabled',
        publicId: 'mock-image-id'
      };
    }

    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto:good' }
            ]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id
              });
            }
          }
        );

        uploadStream.end(imageBuffer);
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  async uploadBase64Image(base64String, folder = 'pawmitra') {
    if (!this.initialized) {
      return {
        url: 'https://via.placeholder.com/800x600?text=Image+Upload+Disabled',
        publicId: 'mock-image-id'
      };
    }

    try {
      const result = await cloudinary.uploader.upload(base64String, {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good' }
        ],
        timeout: 60000
      });

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('Error uploading base64 to Cloudinary:', error);
      // Return placeholder on error so incident can still be created
      return {
        url: 'https://via.placeholder.com/400x300?text=Image+Upload+Failed',
        publicId: `error_${Date.now()}`
      };
    }
  }

  async deleteImage(publicId) {
    if (!this.initialized) {
      return { result: 'ok' };
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  }

  async uploadMultipleImages(imageBuffers, folder = 'pawmitra') {
    const uploadPromises = imageBuffers.map(buffer => 
      this.uploadImage(buffer, folder)
    );
    
    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  }
}

// Create singleton instance
const cloudinaryService = new CloudinaryService();

export default cloudinaryService;
