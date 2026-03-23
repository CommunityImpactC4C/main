import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { type ComponentPropsWithoutRef, createElement } from "react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

type MockNextImageProps = Omit<ComponentPropsWithoutRef<"img">, "src"> & {
  src: string | { src: string };
};

vi.mock("next/image", () => ({
  default: ({ src, alt = "", ...props }: MockNextImageProps) =>
    createElement("img", {
      alt,
      src: typeof src === "string" ? src : src.src,
      ...props,
    }),
}));
