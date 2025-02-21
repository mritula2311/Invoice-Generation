import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const EditableField = ({ cellData, onItemizedItemEdit }) => {
  const {
    leading,
    textAlign = 'text-start',
    type = 'text',
    placeholder = '',
    min,
    name = '',
    id = '',
    value = '',
    step,
    precision = 2,
  } = cellData;

  return (
    <InputGroup className="my-2 flex-nowrap shadow-sm rounded border bg-white">
      {leading && (
        <InputGroup.Text className="bg-primary text-white fw-bold border-0 px-3 rounded-start">
          {leading}
        </InputGroup.Text>
      )}
      <Form.Control
        className={`${textAlign} border-0 shadow-sm rounded-end px-2`}
        type={type}
        placeholder={placeholder}
        min={type === 'number' ? min || 0 : undefined}
        name={name}
        id={id}
        value={type === 'number' ? parseFloat(value).toFixed(precision) : value}
        step={type === 'number' ? step || '1' : undefined}
        aria-label={name}
        onChange={onItemizedItemEdit || (() => {})}
        required
      />
    </InputGroup>
  );
};

export default EditableField;
