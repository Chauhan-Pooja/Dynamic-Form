import React, { useState } from 'react';
import './formRenderer.css';

const FormRenderer = ({ schema = [], onSubmit }) => {
  const getInitialState = () =>
    schema.reduce((acc, field) => {
      acc[field.name] = field.type === 'multiselect' ? [] : field.value || '';
      return acc;
    }, {});

  const [formData, setFormData] = useState(getInitialState());
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateField = (field, value) => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return field.error || 'This field is required';
    }
    if (field.validator && value) {
      const pattern = new RegExp(field.validator);
      if (!pattern.test(value)) {
        return field.error || 'Invalid input';
      }
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    schema.forEach(field => {
      if (field.type === 'card') {
        field.data.forEach(subField => {
          const error = validateField(subField, formData[subField.name]);
          if (error) newErrors[subField.name] = error;
        });
      } else {
        const error = validateField(field, formData[field.name]);
        if (error) newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      if (onSubmit) onSubmit(formData);
      setFormData(getInitialState());
      setSuccessMessage('Form submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e, name) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    handleChange(name, selected);
  };

  const handleFileChange = async (e, name) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: form,
      });

      const result = await res.json();
      if (result.success && result.filePath) {
        handleChange(name, result.filePath.replace(/\\/g, '/'));
      } else {
        console.error('Upload failed:', result);
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const fieldRenderers = {
    text: (field, value) => (
      <input
        type="text"
        name={field.name}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => handleChange(field.name, e.target.value)}
      />
    ),
    email: (field, value) => (
      <input
        type="email"
        name={field.name}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => handleChange(field.name, e.target.value)}
      />
    ),
    number: (field, value) => (
      <input
        type="number"
        name={field.name}
        min={field.min}
        max={field.max}
        value={value}
        onChange={(e) => handleChange(field.name, e.target.value)}
      />
    ),
    date: (field, value) => (
      <input
        type="date"
        name={field.name}
        min={field.min}
        max={field.max}
        value={value}
        onChange={(e) => handleChange(field.name, e.target.value)}
      />
    ),
    select: (field, value) => (
      <select
        name={field.name}
        value={value}
        onChange={(e) => handleChange(field.name, e.target.value)}
      >
        <option value="">-- Select --</option>
        {field.data.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.title}</option>
        ))}
      </select>
    ),
    multiselect: (field, value) => (
      <select
        name={field.name}
        multiple
        value={value}
        onChange={(e) => handleMultiSelectChange(e, field.name)}
      >
        {field.data.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.title}</option>
        ))}
      </select>
    ),
    file: (field, value) => (
      <div>
        <input
          type="file"
          name={field.name}
          onChange={(e) => handleFileChange(e, field.name)}
        />
        {value && (
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Preview:</strong><br />
            <img
              src={`http://localhost:5000/${value}`}
              alt="Uploaded"
              width={150}
            />
          </div>
        )}
      </div>
    ),
    card: (field) => (
      <fieldset>
        <legend>{field.title}</legend>
        {field.data.map((subField, subIndex) => (
          <div key={subIndex} className="form-field">
            <label>{subField.title}</label>
            <div>{renderField(subField)}</div>
            {errors[subField.name] && (
              <span className="error">{errors[subField.name]}</span>
            )}
          </div>
        ))}
      </fieldset>
    )
  };

  const renderField = (field) => {
    const value = formData[field.name];
    const renderer = fieldRenderers[field.type];
    return renderer ? renderer(field, value) : null;
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {schema.map((field, index) => (
        <div key={index} className="form-field">
          <label><strong>{field.title}</strong></label>
          <div>{renderField(field)}</div>
          {field.type !== 'card' && errors[field.name] && (
            <span className="error">{errors[field.name]}</span>
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
      {successMessage && (
        <div className="success">{successMessage}</div>
      )}
    </form>
  );
};

export default FormRenderer;
