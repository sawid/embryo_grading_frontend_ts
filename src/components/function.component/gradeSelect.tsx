import React from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

interface GradeSelectProps {
  options: any;
  selectedOption: any;
  onChange: (selected: any, index: number) => void;
  index: number;
}

const GradeSelect: React.FC<GradeSelectProps> = ({ options, selectedOption, onChange, index }) => {
  return (
    <div>
      <Typeahead
        id={`searchable-select-${index}`}
        options={options}
        onChange={(selected: any) => onChange(selected, index)}
        selected={selectedOption}
        labelKey="label"
        placeholder="Select an option..."
      />
      {selectedOption.length > 0 && (
        <div>
          <p>Selected Option: {selectedOption[0].label}</p>
        </div>
      )}
    </div>
  );
};

export default GradeSelect;
