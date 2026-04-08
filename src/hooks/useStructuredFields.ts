import { useState, useCallback, useMemo } from 'react';

interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
}

interface FieldConfig extends FieldValidation {
  id: string;
  label: string;
  prompt: string;
  placeholder?: string;
}

interface FrameworkConfig {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}

export function useStructuredFields(frameworks: FrameworkConfig[]) {
  // Initialize values for all frameworks
  const initialValues = useMemo(() => {
    const values: Record<string, Record<string, string>> = {};
    frameworks.forEach((fw) => {
      values[fw.id] = {};
      fw.fields.forEach((field) => {
        values[fw.id][field.id] = '';
      });
    });
    return values;
  }, [frameworks]);

  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Record<string, Record<string, boolean>>>({});

  const setFieldValue = useCallback(
    (frameworkId: string, fieldId: string, value: string) => {
      setValues((prev) => ({
        ...prev,
        [frameworkId]: {
          ...prev[frameworkId],
          [fieldId]: value,
        },
      }));
    },
    []
  );

  const setFieldTouched = useCallback(
    (frameworkId: string, fieldId: string) => {
      setTouched((prev) => ({
        ...prev,
        [frameworkId]: {
          ...prev[frameworkId],
          [fieldId]: true,
        },
      }));
    },
    []
  );

  const validateField = useCallback(
    (frameworkId: string, fieldId: string): string | null => {
      const framework = frameworks.find((fw) => fw.id === frameworkId);
      if (!framework) return null;

      const field = framework.fields.find((f) => f.id === fieldId);
      if (!field) return null;

      const value = values[frameworkId]?.[fieldId] || '';
      const { required, minLength } = field;

      if (required && !value.trim()) {
        return 'This field is required';
      }

      if (minLength && value.length < minLength) {
        return `Minimum ${minLength} characters required`;
      }

      return null;
    },
    [frameworks, values]
  );

  const getFieldStatus = useCallback(
    (frameworkId: string, fieldId: string) => {
      const error = validateField(frameworkId, fieldId);
      const value = values[frameworkId]?.[fieldId] || '';
      const isTouched = touched[frameworkId]?.[fieldId];

      return {
        value,
        error: isTouched ? error : null,
        isValid: !error,
        isComplete: !error && value.length > 0,
        isTouched,
      };
    },
    [values, touched, validateField]
  );

  const getFrameworkStatus = useCallback(
    (frameworkId: string) => {
      const framework = frameworks.find((fw) => fw.id === frameworkId);
      if (!framework) return { completed: 0, total: 0, percentage: 0 };

      const fieldStatuses = framework.fields.map((field) =>
        getFieldStatus(frameworkId, field.id)
      );

      const completed = fieldStatuses.filter((s) => s.isComplete).length;
      const total = framework.fields.length;
      const validCount = fieldStatuses.filter((s) => s.isValid).length;

      return {
        completed,
        total,
        percentage: Math.round((completed / total) * 100),
        isValid: validCount === total,
        fieldStatuses,
      };
    },
    [frameworks, getFieldStatus]
  );

  const getAllValues = useCallback(() => {
    return values;
  }, [values]);

  const setAllValues = useCallback((newValues: Record<string, Record<string, string>>) => {
    setValues(newValues);
  }, []);

  const resetFramework = useCallback((frameworkId: string) => {
    const framework = frameworks.find((fw) => fw.id === frameworkId);
    if (!framework) return;

    setValues((prev) => ({
      ...prev,
      [frameworkId]: framework.fields.reduce((acc, field) => {
        acc[field.id] = '';
        return acc;
      }, {} as Record<string, string>),
    }));

    setTouched((prev) => ({
      ...prev,
      [frameworkId]: {},
    }));
  }, [frameworks]);

  const resetAll = useCallback(() => {
    setValues(initialValues);
    setTouched({});
  }, [initialValues]);

  return {
    values,
    setFieldValue,
    setFieldTouched,
    getFieldStatus,
    getFrameworkStatus,
    getAllValues,
    setAllValues,
    resetFramework,
    resetAll,
    validateField,
  };
}
