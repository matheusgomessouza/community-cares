import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MenuIconComponent } from "./MenuIconComponent";
import UsabilityContext from "../contexts/usability";

describe("MenuIconComponent", () => {
  it("renders correctly and toggles filter", () => {
    const setShowFilterMock = jest.fn();
    const showFilter = false;

    const { getByTestId } = render(
      <UsabilityContext.Provider
        value={{
          showFilter,
          setShowFilter: setShowFilterMock,
          foreignUser: false,
          setForeignUser: jest.fn(),
          selectedFilters: [],
          setSelectedFilters: jest.fn(),
        }}
      >
        <MenuIconComponent />
      </UsabilityContext.Provider>
    );

    const button = getByTestId("press-to-show-filter");
    expect(button).toBeTruthy();

    fireEvent.press(button);

    expect(setShowFilterMock).toHaveBeenCalledWith(true);
  });
});