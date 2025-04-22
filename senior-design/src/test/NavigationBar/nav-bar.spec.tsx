import {describe, expect, it} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {NavBar} from "../../components/NavigationBar/nav-bar.tsx";
import {MemoryRouter} from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useNavigate: () => mockNavigate,
    };
});

describe("NavBar Component", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it("renders navigation buttons", () => {
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        expect(screen.getByText("Query")).toBeVisible();
        expect(screen.getByText("History")).toBeVisible();
        expect(screen.getByText("Utilities")).toBeVisible();
        expect(screen.getByText("Settings")).toBeVisible();
        expect(screen.getByText("About Us")).toBeVisible();
        expect(screen.getByText("User Manual")).toBeVisible();
    });

    it("renders HADES title", () => {
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        expect(screen.getByText("HADES")).toBeVisible();
    });

    it("navigates to Query when clicked", () => {
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText("Query"));
        expect(mockNavigate).toHaveBeenCalledExactlyOnceWith("/")
    });

    it("navigates to History when clicked", () => {
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText("History"));
        expect(mockNavigate).toHaveBeenCalledExactlyOnceWith("/History")
    });

    it("navigates to Utilities when clicked", () => {
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText("Utilities"));
        expect(mockNavigate).toHaveBeenCalledExactlyOnceWith("/Utilities");
    });

    it("navigates to Settings when clicked", () => {
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText("Settings"));
        expect(mockNavigate).toHaveBeenCalledExactlyOnceWith("/Settings");
    });

    it("navigates to About Us when clicked", () => {
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText("About Us"));
        expect(mockNavigate).toHaveBeenCalledExactlyOnceWith("/About_Us")
    });

    it("navigates to User Manual when clicked", () => {
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText("User Manual"));
        expect(mockNavigate).toHaveBeenCalledExactlyOnceWith("/User_Manual")
    });
});