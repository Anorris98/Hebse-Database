// src/test/Settings/DatabaseSetup/database-setup.spec.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DatabaseSetup from "../../../components/Settings/DatabaseSetup/database-setup";
//import React from "react";
import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("../../../components/HelpTextField/help-text-field.tsx", () => ({
    default: ({ label, value, onChange }: any) => (
      <input
        aria-label={label}
        value={value}
        onChange={onChange}
        data-testid={label}
      />
    ),
  }));

// Mock utility functions
vi.mock("../../../components/Utilities/utility-functions.ts", () => ({
  encrypt: vi.fn((x: string) => Promise.resolve(`encrypted(${x})`)),
  decrypt: vi.fn((x: string) => Promise.resolve(x)),
  enableTunnel: vi.fn(),
}));

beforeEach(() => {
    vi.stubGlobal("alert", vi.fn());
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("DatabaseSetup component", () => {
  it("renders the main title and profile input", async () => {
    render(<DatabaseSetup />);
    
    await waitFor(() => {
        expect(screen.getByText(/Database Connection Setup/i)).toBeInTheDocument();
        expect(screen.getByLabelText("Profile Name")).toBeInTheDocument();
      });
  });

  it("allows entering a profile name", async () => {
    render(<DatabaseSetup />);
    const profileInput = screen.getByLabelText("Profile Name");
    fireEvent.change(profileInput, { target: { value: "test-profile" } });

    await waitFor(() => {
        expect(profileInput).toHaveValue("test-profile");
    });
  });

  it("saves profile when 'SAVE DATABASE SETTINGS' is clicked", async () => {
    render(<DatabaseSetup />);
    fireEvent.change(screen.getByLabelText("Profile Name"), {
      target: { value: "test-db" },
    });
    fireEvent.change(screen.getByLabelText("Database Name"), {
      target: { value: "mydb" },
    });

    fireEvent.click(screen.getByRole("button", { name: /SAVE DATABASE SETTINGS/i }));

    await waitFor(() => {
      expect(localStorage.getItem("db_list")).toMatch(/encrypted/);
      expect(localStorage.getItem("db_settings")).toMatch(/encrypted/);
    });
  });

  it("displays alert if saving with no profile name", async () => {
    const alertMock = vi.fn();
    window.alert = alertMock;

    render(<DatabaseSetup />);
    fireEvent.click(screen.getByRole("button", { name: /SAVE DATABASE SETTINGS/i }));

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith("Please enter a Profile Name before saving.")
    );
  });
});