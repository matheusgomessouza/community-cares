import {
  getLocations,
  postAchievements,
  postAuthenticateUser,
} from "./community-cares";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { AchievementsProps } from "../interfaces";

jest.mock("axios", () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };
  return {
    create: jest.fn(() => mockInstance),
    isAxiosError: jest.fn(),
    mockInstance,
  };
});

describe("community-cares services", () => {
  const mockAxiosInstance = (axios as any).mockInstance;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getLocations", () => {
    it("fetches locations successfully", async () => {
      const mockResponse = { data: [{ id: 1, name: "Location 1" }] };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const response = await getLocations();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/locations");
      expect(response).toEqual(mockResponse);
    });

    it("handles getLocations error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const mockError = new Error("Network Error");
      mockAxiosInstance.get.mockRejectedValueOnce(mockError);

      const response = await getLocations();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Unable to retrieve Locations data /getLocations",
        mockError
      );
      expect(response).toBeUndefined();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("postAchievements", () => {
    it("posts achievements successfully with token", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
        "mock-token"
      );
      mockAxiosInstance.post.mockResolvedValueOnce({});

      await postAchievements({
        username: "testuser",
        provider: "github",
        achievements: AchievementsProps.TRACE_LOCATION,
      });

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("github-token");
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/achievements",
        {
          username: "testuser",
          provider: "github",
          achievements: AchievementsProps.TRACE_LOCATION,
        },
        {
          headers: {
            Authorization: "Bearer mock-token",
          },
        }
      );
    });

    it("does not post if no token", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      await postAchievements({
        username: "testuser",
        provider: "github",
        achievements: AchievementsProps.TRACE_LOCATION,
      });

      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });

    it("handles postAchievements error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const mockError = new Error("Network Error");
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
        "mock-token"
      );
      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await postAchievements({
        username: "testuser",
        provider: "github",
        achievements: AchievementsProps.TRACE_LOCATION,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Unable to save achievements progress /postAchievement",
        mockError
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("postAuthenticateUser", () => {
    it("authenticates successfully", async () => {
      const mockResponse = { data: { access_token: "mock-token" } };
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const response = await postAuthenticateUser("mock-code", "mock-verifier");
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/users/authenticate/github",
        {
          code: "mock-code",
          code_verifier: "mock-verifier",
          env: "mobile",
        }
      );
      expect(response).toEqual(mockResponse);
    });

    it("handles axios error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const mockError = {
        message: "Axios Error",
        response: { data: "Bad Request" },
        isAxiosError: true,
      };
      mockAxiosInstance.post.mockRejectedValueOnce(mockError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      await postAuthenticateUser("mock-code", "mock-verifier");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Unable to authenticate, please try again /postAuthenticateUser | Data: Bad Request | Message: Axios Error`
      );
      consoleErrorSpy.mockRestore();
    });

    it("handles unexpected error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const mockError = new Error("Network Error");
      mockAxiosInstance.post.mockRejectedValueOnce(mockError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(false);

      await postAuthenticateUser("mock-code", "mock-verifier");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Unexpected error:",
        mockError
      );
      consoleErrorSpy.mockRestore();
    });
  });
});
