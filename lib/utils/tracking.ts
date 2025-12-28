export function generateTrackingNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `AFG-${year}-${random}`;
}

export function formatTrackingNumber(trackingNumber: string): string {
  return trackingNumber.toUpperCase().replace(/\s/g, '');
}
