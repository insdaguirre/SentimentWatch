/**
 * Utility functions for storage formatting and calculations
 */

/**
 * Format bytes into human-readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted string (e.g., "45.2 MB")
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculate storage usage percentage
 * @param {number} used - Used bytes
 * @param {number} max - Maximum bytes
 * @returns {number} Usage percentage (0-100)
 */
function calculateUsagePercent(used, max) {
  if (max === 0) return 0;
  return Math.min((used / max) * 100, 100);
}

/**
 * Get storage color based on usage percentage
 * @param {number} percent - Usage percentage
 * @returns {string} CSS color class
 */
function getStorageColor(percent) {
  if (percent >= 90) return 'storage-critical';
  if (percent >= 75) return 'storage-warning';
  return 'storage-normal';
}

module.exports = {
  formatBytes,
  calculateUsagePercent,
  getStorageColor
};
