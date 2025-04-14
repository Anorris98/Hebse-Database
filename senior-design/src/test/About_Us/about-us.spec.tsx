import {describe, it, expect} from "vitest";
import {AboutUs} from "../../components/About_Us/about-us.tsx";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("AboutUs Component", () => {
    it("renders the component without crashing", () => {
        render(<AboutUs />);
        expect(screen.getByText("About Us")).toBeVisible();
    });

    it("displays the correct description", () => {
        render(<AboutUs />);
        expect(screen.getByText(/The creators of HADES are interdisciplinary team/i)).toBeVisible();
    });

    it("contains the project website link", () => {
        render(<AboutUs />);
        const linkElement = screen.getByRole("link", { name: /https:\/\/sdmay25-20.sd.ece.iastate.edu\//i });
        expect(linkElement).toBeVisible();
        expect(linkElement).toHaveAttribute("href", "https://sdmay25-20.sd.ece.iastate.edu/");
    });
});
