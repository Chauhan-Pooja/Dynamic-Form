import React from 'react';
import FormRenderer from './FormRenderer';
import formSchema from './formSchema'

const App = () => {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dynamic Form</h2>
      <FormRenderer schema={formSchema} onSubmit={handleSubmit} />
    </div>
  );
};

export default App;
