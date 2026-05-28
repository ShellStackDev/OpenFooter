declare module "react" {
  export type CSSProperties = Record<string, string | number>;
  export function createElement(type: string, props?: Record<string, unknown>): unknown;
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
}

declare module "react/jsx-runtime" {
  export const jsx: unknown;
  export const jsxs: unknown;
  export const Fragment: unknown;
}
