/* istanbul ignore file -- @preserve */
export const enableTunnel = async (enable: boolean) => {
    const savedSettings = localStorage.getItem("db_settings");
    if (!savedSettings) {
        return;
    }
    if (enable) {
      const parsed = JSON.parse(savedSettings);
      const data = {
        databaseHost: parsed["databaseHost"],
        sshHost: parsed["sshHost"],
        sshPort: parsed["sshPort"],
        sshUser: parsed["sshUser"],
        sshKey: parsed["sshKey"]
      }
      try {
        const response = await fetch(`http://localhost:3001/start-tunnel`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
      } catch (error) {
          console.error("Error fetching query result:", error);
      }
    } else {
      try {
        const response = await fetch(`http://localhost:3001/stop-tunnel`, {
            method: "POST"
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
      } catch (error) {
          console.error("Error fetching query result:", error);
      }
    }
  }