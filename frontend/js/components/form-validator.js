/**
 * Form Validation Component
 * Uses native Constraint Validation API + custom validators
 */

class FormValidator {
  constructor(formElement, options = {}) {
    this.form = formElement;
    this.options = {
      validateOnBlur: true,
      validateOnInput: false,
      showErrorsImmediately: false,
      errorClass: 'field-error',
      errorMessageClass: 'error-message',
      ...options,
    };

    this.customValidators = {};
    this.touched = new Set();

    this.init();
  }

  /**
   * Initialize form validation
   */
  init() {
    this.form.setAttribute('novalidate', '');

    // Handle form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Handle field blur events
    if (this.options.validateOnBlur) {
      this.form.querySelectorAll('input, textarea, select').forEach((field) => {
        field.addEventListener('blur', () => {
          this.touched.add(field.name);
          this.validateField(field);
        });
      });
    }

    // Handle field input events
    if (this.options.validateOnInput) {
      this.form.querySelectorAll('input, textarea, select').forEach((field) => {
        field.addEventListener('input', () => {
          if (this.touched.has(field.name)) {
            this.validateField(field);
          }
        });
      });
    }
  }

  /**
   * Add custom validation rule
   * @param {string} fieldName - Name of the field
   * @param {Function} validator - Validation function (value) => boolean | string
   */
  addRule(fieldName, validator) {
    if (!this.customValidators[fieldName]) {
      this.customValidators[fieldName] = [];
    }
    this.customValidators[fieldName].push(validator);
  }

  /**
   * Validate a single field
   * @param {HTMLElement} field - Input field element
   */
  validateField(field) {
    // Clear previous errors
    this.clearFieldError(field);

    // Check native validation first
    if (!field.checkValidity()) {
      this.showFieldError(field, field.validationMessage);
      return false;
    }

    // Check custom validators
    const customValidators = this.customValidators[field.name];
    if (customValidators) {
      for (const validator of customValidators) {
        const result = validator(field.value, this.getFormData());

        if (result !== true) {
          const errorMessage = typeof result === 'string' ? result : 'Invalid value';
          this.showFieldError(field, errorMessage);
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Validate entire form
   */
  validateForm() {
    let isValid = true;
    const fields = this.form.querySelectorAll('input, textarea, select');

    fields.forEach((field) => {
      this.touched.add(field.name);
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Show error message for a field
   * @param {HTMLElement} field - Input field
   * @param {string} message - Error message
   */
  showFieldError(field, message) {
    field.classList.add(this.options.errorClass);
    field.setAttribute('aria-invalid', 'true');

    // Create or update error message element
    let errorElement = field.parentElement.querySelector(`.${this.options.errorMessageClass}`);

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = this.options.errorMessageClass;
      errorElement.setAttribute('role', 'alert');
      field.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
  }

  /**
   * Clear error message for a field
   * @param {HTMLElement} field - Input field
   */
  clearFieldError(field) {
    field.classList.remove(this.options.errorClass);
    field.setAttribute('aria-invalid', 'false');

    const errorElement = field.parentElement.querySelector(`.${this.options.errorMessageClass}`);
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Clear all errors
   */
  clearAllErrors() {
    this.form.querySelectorAll('input, textarea, select').forEach((field) => {
      this.clearFieldError(field);
    });
  }

  /**
   * Get form data as object
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  }

  /**
   * Handle form submission
   */
  async handleSubmit() {
    if (this.validateForm()) {
      const data = this.getFormData();

      if (this.options.onSubmit) {
        try {
          await this.options.onSubmit(data);
        } catch (error) {
          if (this.options.onError) {
            this.options.onError(error);
          }
        }
      }
    } else {
      // Focus first invalid field
      const firstInvalid = this.form.querySelector(`.${this.options.errorClass}`);
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  }

  /**
   * Reset form and clear all validation state
   */
  reset() {
    this.form.reset();
    this.clearAllErrors();
    this.touched.clear();
  }
}

// Common validation helpers
const validators = {
  /**
   * Email validator
   */
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) || 'Please enter a valid email address';
  },

  /**
   * Password strength validator
   */
  passwordStrength: (minLength = 8) => {
    return (value) => {
      if (value.length < minLength) {
        return `Password must be at least ${minLength} characters`;
      }
      if (!/[A-Z]/.test(value)) {
        return 'Password must contain at least one uppercase letter';
      }
      if (!/[a-z]/.test(value)) {
        return 'Password must contain at least one lowercase letter';
      }
      if (!/[0-9]/.test(value)) {
        return 'Password must contain at least one number';
      }
      return true;
    };
  },

  /**
   * Password match validator
   */
  passwordMatch: (passwordFieldName) => {
    return (value, formData) => {
      return value === formData[passwordFieldName] || 'Passwords do not match';
    };
  },

  /**
   * Required field validator
   */
  required: (value) => {
    return value.trim().length > 0 || 'This field is required';
  },

  /**
   * Min length validator
   */
  minLength: (length) => {
    return (value) => {
      return value.length >= length || `Must be at least ${length} characters`;
    };
  },

  /**
   * Max length validator
   */
  maxLength: (length) => {
    return (value) => {
      return value.length <= length || `Must be no more than ${length} characters`;
    };
  },

  /**
   * Pattern validator
   */
  pattern: (regex, message) => {
    return (value) => {
      return regex.test(value) || message;
    };
  },

  /**
   * URL validator
   */
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return 'Please enter a valid URL';
    }
  },
};

export { FormValidator, validators };
