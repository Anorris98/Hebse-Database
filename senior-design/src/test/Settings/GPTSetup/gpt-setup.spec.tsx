import { vi, describe, it, expect} from "vitest";
import "@testing-library/jest-dom";
import GptSetup from "../../../components/Settings/GPTSetup/gpt-setup.tsx";
import * as utils from "../../../components/Utilities/utility-functions.ts"
import { fireEvent, render, screen, waitFor } from "@testing-library/react";


// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || undefined,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock encrypt and decrypt
vi.spyOn(utils, "encrypt").mockImplementation((text: string) => Promise.resolve(`encrypted(${text})`));
vi.spyOn(utils, "decrypt").mockImplementation((text: string) => Promise.resolve(text.replace(/^encrypted\((.*)\)$/, "$1")));

// Mock alert
window.alert = vi.fn();

describe("GptSetup component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders all fields correctly", () => {
    render(<GptSetup />);
    expect(screen.getByText(/GPT API Settings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/API Key/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Model/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Tokens/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save api settings/i })).toBeInTheDocument();
  });

  it("updates input values and saves settings", async () => {
    render(<GptSetup />);
    const [apiKeyInput] = screen.getAllByLabelText(/API Key/i);
    fireEvent.change(apiKeyInput, { target: { value: "test-key"}});
    fireEvent.change(screen.getByLabelText(/Model \(e\.g\., gpt-4, gpt-3\.5-turbo\)/i), { target: { value: "gpt-4" } });
    fireEvent.change(screen.getByLabelText(/Max Tokens/i), { target: { value: "150" } });

    fireEvent.click(screen.getByRole("button", { name: /save api settings/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Settings saved!");
      expect(localStorage.getItem("gpt_settings")).toMatch(/encrypted/);
    });
  });

  it("loads and decrypts saved settings from localStorage", async () => {
    const savedSettings = {
      apiKey: "stored-key",
      model: "gpt-3.5-turbo",
      max_tokens: 123,
      temperature: 0.8,
    };
    localStorage.setItem("gpt_settings", `encrypted(${JSON.stringify(savedSettings)})`);

    render(<GptSetup />);

    await waitFor(() => {
      expect(screen.getByLabelText(/API Key/i, { selector: 'input' })).toHaveValue("stored-key");
      expect(screen.getByLabelText(/Model/i, { selector: 'input' })).toHaveValue("gpt-3.5-turbo");
      expect(screen.getByLabelText(/Max Tokens/i, { selector: 'input' })).toHaveValue(123);
    });
  });
});