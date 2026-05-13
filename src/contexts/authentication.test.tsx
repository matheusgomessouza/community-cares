import { renderHook, act } from "@testing-library/react-native";
import { useContext } from "react";
import AuthenticationContext, { AuthenticationProvider } from "./authentication";
import * as SecureStore from "expo-secure-store";
import * as Services from "@services/index";

jest.mock("@services/index", () => ({
  CommunityCaresService: {
    postAuthenticateUser: jest.fn(),
  },
}));

describe("AuthenticationContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides default values", () => {
    const { result } = renderHook(() => useContext(AuthenticationContext), {
      wrapper: AuthenticationProvider,
    });

    expect(result.current.isUserAuthenticated).toBe(false);
    expect(result.current.showSignInError).toBe(false);
    expect(result.current.profileData).toEqual({});
    expect(result.current.isAuthenticating).toBe(false);
  });

  it("codeExchange success flow", async () => {
    const mockPostAuthenticateUser = Services.CommunityCaresService.postAuthenticateUser as jest.Mock;
    mockPostAuthenticateUser.mockResolvedValueOnce({
      data: { access_token: "mock-token" },
    });
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("mock-token");

    const { result } = renderHook(() => useContext(AuthenticationContext), {
      wrapper: AuthenticationProvider,
    });

    await act(async () => {
      await result.current.codeExchange("mock-code", "mock-verifier");
    });

    expect(result.current.isAuthenticating).toBe(false);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("github-token", "mock-token");
    expect(result.current.isUserAuthenticated).toBe(true);
    expect(result.current.showSignInError).toBe(false);
  });

  it("codeExchange error flow", async () => {
    const mockPostAuthenticateUser = Services.CommunityCaresService.postAuthenticateUser as jest.Mock;
    mockPostAuthenticateUser.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useContext(AuthenticationContext), {
      wrapper: AuthenticationProvider,
    });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await act(async () => {
      await result.current.codeExchange("mock-code", "mock-verifier");
    });

    expect(result.current.isAuthenticating).toBe(false);
    expect(result.current.showSignInError).toBe(true);
    expect(result.current.isUserAuthenticated).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});