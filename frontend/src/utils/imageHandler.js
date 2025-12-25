import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Image Handler Utility
 * Provides image processing, compression, and permission handling
 */

class ImageHandler {
  /**
   * Request camera permissions
   */
  static async requestCameraPermission() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  /**
   * Request media library permissions
   */
  static async requestMediaLibraryPermission() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      return false;
    }
  }

  /**
   * Take a photo with the camera
   * @param {Object} options - Camera options
   * @returns {Promise<Object>} Image result with uri and base64
   */
  static async takePhoto(options = {}) {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        throw new Error('Camera permission denied');
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: options.allowsEditing !== false,
        aspect: options.aspect || [4, 3],
        quality: options.quality || 0.8,
        base64: true,
        ...options,
      });

      if (result.canceled) {
        return null;
      }

      return result.assets[0];
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  /**
   * Pick an image from gallery
   * @param {Object} options - Picker options
   * @returns {Promise<Object>} Image result with uri and base64
   */
  static async pickImage(options = {}) {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        throw new Error('Media library permission denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: options.allowsEditing !== false,
        aspect: options.aspect || [4, 3],
        quality: options.quality || 0.8,
        base64: true,
        allowsMultipleSelection: options.allowsMultipleSelection || false,
        ...options,
      });

      if (result.canceled) {
        return null;
      }

      return options.allowsMultipleSelection ? result.assets : result.assets[0];
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  }

  /**
   * Compress an image
   * @param {string} uri - Image URI
   * @param {Object} options - Compression options
   * @returns {Promise<Object>} Compressed image
   */
  static async compressImage(uri, options = {}) {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        options.resize ? [{ resize: options.resize }] : [],
        {
          compress: options.compress || 0.7,
          format: options.format || ImageManipulator.SaveFormat.JPEG,
          base64: options.base64 !== false,
        }
      );

      return manipResult;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  }

  /**
   * Resize an image
   * @param {string} uri - Image URI
   * @param {Object} size - Target size {width, height}
   * @returns {Promise<Object>} Resized image
   */
  static async resizeImage(uri, size) {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: size }],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      return manipResult;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  }

  /**
   * Convert image to base64
   * @param {string} uri - Image URI
   * @returns {Promise<string>} Base64 string
   */
  static async toBase64(uri) {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      return `data:image/jpeg;base64,${manipResult.base64}`;
    } catch (error) {
      console.error('Error converting to base64:', error);
      throw error;
    }
  }

  /**
   * Process image for upload (compress and convert to base64)
   * @param {string} uri - Image URI
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} Processed image with uri and base64
   */
  static async processForUpload(uri, options = {}) {
    try {
      const maxWidth = options.maxWidth || 1200;
      const maxHeight = options.maxHeight || 1200;
      const quality = options.quality || 0.7;

      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: maxWidth, height: maxHeight } }],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      return {
        uri: manipResult.uri,
        base64: `data:image/jpeg;base64,${manipResult.base64}`,
        width: manipResult.width,
        height: manipResult.height,
      };
    } catch (error) {
      console.error('Error processing image for upload:', error);
      throw error;
    }
  }

  /**
   * Process multiple images for upload
   * @param {Array} images - Array of image objects with uri
   * @param {Object} options - Processing options
   * @returns {Promise<Array>} Array of processed images
   */
  static async processMultipleForUpload(images, options = {}) {
    try {
      const processedImages = await Promise.all(
        images.map(image => this.processForUpload(image.uri, options))
      );
      return processedImages;
    } catch (error) {
      console.error('Error processing multiple images:', error);
      throw error;
    }
  }

  /**
   * Get image dimensions
   * @param {string} uri - Image URI
   * @returns {Promise<Object>} Image dimensions {width, height}
   */
  static async getImageDimensions(uri) {
    try {
      return new Promise((resolve, reject) => {
        if (typeof Image !== 'undefined') {
          // Web platform
          const img = new Image();
          img.onload = () => {
            resolve({ width: img.width, height: img.height });
          };
          img.onerror = reject;
          img.src = uri;
        } else {
          // Native platform - use ImageManipulator
          ImageManipulator.manipulateAsync(uri, [], {})
            .then(result => resolve({ width: result.width, height: result.height }))
            .catch(reject);
        }
      });
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      throw error;
    }
  }

  /**
   * Validate image file
   * @param {Object} image - Image object
   * @param {Object} constraints - Validation constraints
   * @returns {Object} Validation result {valid, error}
   */
  static validateImage(image, constraints = {}) {
    const maxSize = constraints.maxSize || 10 * 1024 * 1024; // 10MB default
    const allowedTypes = constraints.allowedTypes || ['image/jpeg', 'image/png', 'image/jpg'];

    // Check file size (if available)
    if (image.fileSize && image.fileSize > maxSize) {
      return {
        valid: false,
        error: `Image size exceeds ${maxSize / (1024 * 1024)}MB limit`,
      };
    }

    // Check file type (if available)
    if (image.type && !allowedTypes.includes(image.type)) {
      return {
        valid: false,
        error: `Image type must be one of: ${allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }
}

export default ImageHandler;
