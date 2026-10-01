/**
 * Generates an official Phethagatsa Store order reference.
 * Example: PHT-4829
 */
export function generateOrderRef(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PHT-${randomSuffix}`;
}

export function isValidOrderRef(ref: string): boolean {
  return /^PHT-\d{4,8}$/i.test(ref.trim());
}
