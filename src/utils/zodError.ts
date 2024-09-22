interface ZodErrorDetail {
  message: string;
  path: string[];
  type: string;
  context: {
    label: string;
    value: string;
    key: string;
  };
}

interface ValidationError {
  errors: ZodErrorDetail[];
}

interface FormattedError {
  message: string;
}

export const formatZodErrors = (validationErrors: ValidationError): Record<string, FormattedError> => {
  return validationErrors.errors.reduce((acc, err) => {
    const path = err.path.join(".");

    if (!acc[path]) {
      acc[path] = { message: err.message };
    }

    return acc;
  }, {} as Record<string, FormattedError>);
};
