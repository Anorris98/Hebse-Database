import {describe, expect, it} from "vitest";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {QueryWelcomeText} from "../../components/QueryWelcomeText/query-welcome-text.tsx";

describe("QueryWelcomeText Component", () => {
    it("renders the component without crashing", () => {
        render(<QueryWelcomeText />);
        expect(screen.getByText("How can I help?")).toBeVisible();
        expect(screen.getByText("How can I help?").parentElement).toHaveStyle("" +
            " backgroundColor: \"gray\",\n" +
            "              borderRadius: \"15px\",\n" +
            "              maxWidth: \"lg\",\n" +
            "              width: \"100%\",\n" +
            "              fontFamily: \"monospace\",\n" +
            "              padding: \"20px\",\n" +
            "              marginTop:\"100px\",\n" +
            "              textAlign: \"center\"")
    });
});
