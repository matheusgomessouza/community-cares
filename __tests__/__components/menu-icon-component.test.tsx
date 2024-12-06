import { act, render, screen, userEvent } from "@testing-library/react-native";
import { expect } from '@jest/globals';

import { MenuIconComponent } from "@components/MenuIconComponent";
import UsabilityContext from "@contexts/usability";

test.skip("given a user click event, should change showFilter context to true", async () => {
  const myContext = {
    showFilter: false,
    setShowFilter: () => null,
    foreignUser: false,
    setForeignUser: () => null,
  };

  render(
    <UsabilityContext.Provider value={myContext}>
      <MenuIconComponent />
    </UsabilityContext.Provider>
  );
  
  const user = userEvent.setup();

  await act(async () => {
    const menuIconButton = screen.getByTestId("press-to-show-filter");
    await user.press(menuIconButton);
  });

  expect(myContext.showFilter).toBeTruthy();
});
