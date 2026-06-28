import { renderHook, act } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { resetLocalStorage } from "../../test/testStorage";
import { AppDataProvider, useAppData } from "./AppDataProvider";

function wrapper({ children }: PropsWithChildren) {
  return <AppDataProvider>{children}</AppDataProvider>;
}

describe("AppDataProvider", () => {
  beforeEach(() => {
    resetLocalStorage();
  });

  it("provides default settings and persists updates", () => {
    const { result, unmount } = renderHook(() => useAppData(), { wrapper });

    expect(result.current.settings.startScreen).toBe("today");

    act(() => {
      result.current.updateSettings({ startScreen: "documents" });
    });

    expect(result.current.settings.startScreen).toBe("documents");

    unmount();
    const { result: freshResult } = renderHook(() => useAppData(), { wrapper });

    expect(freshResult.current.settings.startScreen).toBe("documents");
  });
});
