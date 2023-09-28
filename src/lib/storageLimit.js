export const STORAGE_LIMIT_IN_GB = 600;

export function getUsagePercentage(size) {
  return +((size / STORAGE_LIMIT_IN_GB / 1024 / 1024 / 1024) * 100).toFixed(4);
}

export function hasMoreStorage(currentStorageSize) {
  return currentStorageSize < STORAGE_LIMIT_IN_GB * 1024 * 1024 * 1024;
}
