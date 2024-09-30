const errorBlacklist = [
  // Should be removed in coming version of recharts
  "Warning: XAxis: Support for defaultProps will be removed from function components in a future major release",
  "Warning: %s: Support for defaultProps will be removed from function components in a future major release.",
];

// TODO find a cleaner way to run client code before startup
const clientSetup = () => {
  const originalLog = console.error;

  console.error = (msg?: string) => {
    debugger;
    if (
      errorBlacklist.some(
        (blackListedError: string) => msg && typeof msg === "string" && msg.includes(blackListedError),
      )
    ) {
      return;
    } else {
      originalLog(msg);
    }
  };
};

export default clientSetup;
