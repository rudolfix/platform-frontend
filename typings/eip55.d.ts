declare module "eip55" {
  export function encode(address: string): string;
  export function verify(address: string): boolean;
}
