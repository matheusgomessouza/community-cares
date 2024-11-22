import { render, screen } from "@testing-library/react-native";

import { FrequentlyAskedQuestionCardComponent } from "@components/FrequentlyAskedQuestionCard";

test("given a certain text props, user should see the FAQ and answer", () => {
  render(
    <FrequentlyAskedQuestionCardComponent
      questionLabel="Why should I write tests?"
      questionAnswer="Because increases reliability of your codebase."
    />
  );

  const FrequentlyAskedQuestionCardComponentQuestionLabel = screen.getByRole(
    "text",
    {
      name: "Why should I write tests?",
    }
  );
  const FrequentlyAskedQuestionCardComponentQuestionAnswer = screen.getByRole(
    "text",
    {
      name: "Because increases reliability of your codebase.",
    }
  );

  expect(FrequentlyAskedQuestionCardComponentQuestionLabel).toBeTruthy();
  expect(FrequentlyAskedQuestionCardComponentQuestionAnswer).toBeTruthy();
});
