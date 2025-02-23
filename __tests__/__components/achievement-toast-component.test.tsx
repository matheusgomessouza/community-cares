import { render, screen } from "@testing-library/react-native";
import { expect } from '@jest/globals';
import { AchievementToastComponent } from "@components/AchievementToastComponent";

jest.mock('expo-font', () => ({
  isLoaded: jest.fn().mockReturnValue(true),
}));

test("given achievementDescription, user can see description displayed in the component", () => {
  render(
    <AchievementToastComponent
      achievementDescription="Some description"
      iconName=""
    />
  );

  const achievementComponentDescription = screen.getByRole("text", {
    name: "Some description",
  });
  expect(achievementComponentDescription).toBeTruthy();
});
