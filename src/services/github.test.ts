import { getUserData } from "./github";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

jest.mock("axios", () => {
  const mockInstance = {
    get: jest.fn(),
  };
  return {
    create: jest.fn(() => mockInstance),
    isAxiosError: jest.fn(),
    mockInstance,
  };
});

describe("github services", () => {
  const mockAxiosInstance = (axios as any).mockInstance;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserData", () => {
    it("returns undefined if no token", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      const response = await getUserData();

      expect(response).toBeUndefined();
      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });

    it("fetches user data successfully", async () => {
      const mockData = { name: "Test User", location: "BR" };
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("mock-token");
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockData });

      const response = await getUserData();

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("github-token");
      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/user", {
        headers: {
          Authorization: "Bearer mock-token",
        },
      });
      expect(response).toEqual(mockData);
    });

    it("handles axios error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const mockError = {
        message: "Axios Error",
        response: { status: 401 },
        isAxiosError: true,
      };
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("mock-token");
      mockAxiosInstance.get.mockRejectedValueOnce(mockError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      const response = await getUserData();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Axios error fetching user data: 401 Axios Error"
      );
      expect(response).toBeUndefined();
      consoleErrorSpy.mockRestore();
    });

    it("handles unexpected error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const mockError = new Error("Network Error");
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("mock-token");
      mockAxiosInstance.get.mockRejectedValueOnce(mockError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(false);

      const response = await getUserData();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Unexpected error in getUserData:",
        mockError
      );
      expect(response).toBeUndefined();
      consoleErrorSpy.mockRestore();
    });
  });
});
