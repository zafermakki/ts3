import { useState } from "react";
import { Save, X, UserRound } from "lucide-react";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: "",
  gender: "male",
};

const PHONE_CHARACTERS_REGEX = /^\+?[\d\s().-]*$/;

function validatePhone(phone) {
  const value = phone.trim();

  if (!value) {
    return "Phone number is required.";
  }

  if (!PHONE_CHARACTERS_REGEX.test(value)) {
    return "Only numbers and phone formatting characters are allowed.";
  }

  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return "Phone number must contain between 7 and 15 digits.";
  }

  return "";
}

function UserForm({
  initialValues = {},
  submitLabel = "Save User",
  isSubmitting = false,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(() => ({
    ...EMPTY_FORM,
    ...initialValues,

    age:
      initialValues.age !== undefined &&
      initialValues.age !== null
        ? String(initialValues.age)
        : "",

    phone: initialValues.phone ?? "",
  }));

  const [phoneError, setPhoneError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "phone") {
      // Prevent invalid characters from being entered.
      if (!PHONE_CHARACTERS_REGEX.test(value)) {
        setPhoneError(
          "Only numbers and phone formatting characters are allowed."
        );
        return;
      }

      setFormData((previous) => ({
        ...previous,
        phone: value,
      }));

      // Validate the phone number while the user types.
      setPhoneError(validatePhone(value));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const phone = formData.phone.trim();
    const phoneValidationError = validatePhone(phone);
    const ageValue = formData.age.trim();
    const age = Number(ageValue);

    // Validate phone number.
    setPhoneError(phoneValidationError);

    if (phoneValidationError) {
      return;
    }

    // Validate age.
    if (ageValue === "" || !Number.isInteger(age) || age < 1 || age > 120) {
      return;
    }

    // Validate required text fields.
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      return;
    }

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone,
      age,
      gender: formData.gender,
    };

    await onSubmit(payload);
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="form-section-heading">
        <span className="section-icon">
          <UserRound size={21} />
        </span>

        <div>
          <h2>User Information</h2>
          <p>Enter the user's information below.</p>
        </div>
      </div>

      <div className="form-grid">
        {/* First Name */}
        <div className="form-field">
          <label htmlFor="firstName">
            First Name <span className="required-mark">*</span>
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={handleChange}
            required
            maxLength={50}
          />
        </div>

        {/* Last Name */}
        <div className="form-field">
          <label htmlFor="lastName">
            Last Name <span className="required-mark">*</span>
          </label>

          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            maxLength={50}
          />
        </div>

        {/* Email */}
        <div className="form-field">
          <label htmlFor="email">
            Email Address <span className="required-mark">*</span>
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone - REQUIRED */}
        <div className="form-field">
          <label htmlFor="phone">
            Phone Number <span className="required-mark">*</span>
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => setPhoneError(validatePhone(formData.phone))}
            required
            aria-invalid={Boolean(phoneError)}
            aria-describedby={phoneError ? "phone-error" : undefined}
          />

          {phoneError && (
            <p id="phone-error" className="field-error" role="alert">
              {phoneError}
            </p>
          )}
        </div>

        {/* Age - REQUIRED */}
        <div className="form-field">
          <label htmlFor="age">
            Age <span className="required-mark">*</span>
          </label>

          <input
            id="age"
            name="age"
            type="number"
            min="1"
            max="120"
            step="1"
            placeholder="Enter age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender */}
        <div className="form-field">
          <label htmlFor="gender">Gender</label>

          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X size={18} />
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="button-spinner" />
          ) : (
            <Save size={18} />
          )}

          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default UserForm;