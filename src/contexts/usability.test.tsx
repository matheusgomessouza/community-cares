import { renderHook, act } from "@testing-library/react-native";
import { useContext } from "react";
import UsabilityContext, { UsabilityProvider } from "./usability";

describe("UsabilityContext", () => {
  it("provides default values", () => {
    const { result } = renderHook(() => useContext(UsabilityContext), {
      wrapper: UsabilityProvider,
    });

    expect(result.current.showFilter).toBe(false);
    expect(result.current.foreignUser).toBe(false);
    expect(result.current.selectedFilters).toEqual([]);
  });

  it("updates showFilter", () => {
    const { result } = renderHook(() => useContext(UsabilityContext), {
      wrapper: UsabilityProvider,
    });

    act(() => {
      result.current.setShowFilter(true);
    });

    expect(result.current.showFilter).toBe(true);
  });

  it("updates foreignUser", () => {
    const { result } = renderHook(() => useContext(UsabilityContext), {
      wrapper: UsabilityProvider,
    });

    act(() => {
      result.current.setForeignUser(true);
    });

    expect(result.current.foreignUser).toBe(true);
  });

  it("updates selectedFilters", () => {
    const { result } = renderHook(() => useContext(UsabilityContext), {
      wrapper: UsabilityProvider,
    });

    act(() => {
      result.current.setSelectedFilters(["filter1", "filter2"]);
    });

    expect(result.current.selectedFilters).toEqual(["filter1", "filter2"]);
  });
});
