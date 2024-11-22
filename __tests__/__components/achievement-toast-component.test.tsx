import { render, screen } from "@testing-library/react-native";
import { AchievementToastComponent } from "@components/AchievementToastComponent";

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
