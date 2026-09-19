const requiredEnvironmentVariables = [
  "CLIENT_URL",
  "MONGODB_URI",
  "JWT_SECRET",
];

const validateEnvironment = () => {
  const missingVariables =
    requiredEnvironmentVariables.filter(
      (variableName) =>
        !process.env[variableName]?.trim(),
    );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`,
    );
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error(
      "JWT_SECRET must contain at least 32 characters",
    );
  }

  try {
    new URL(process.env.CLIENT_URL);
  } catch {
    throw new Error(
      "CLIENT_URL must be a valid URL, for example http://localhost:5173",
    );
  }
};

export default validateEnvironment;