import { Select } from 'react-daisyui';

interface SelectWithLabelProps {
  label: string;
  name: string; 
  onChange: any;
  error?: string;
  value: string;
  descriptionText?: string;
  options: SelectObject[];
}
export interface SelectObject {
  id: string | number;
  name: string;
  value: string;
}
const SelectWithLabel = (props: SelectWithLabelProps) => {
  const { label, error, options, descriptionText, onChange, value, name } = props;

  const classes = Array<string>();

  if (error) {
    classes.push('input-error');
  }

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <Select
        className={classes.join(' ')}
        name={name}
        onChange={onChange}
        value={value}
        required
      >
        {options.map((role) => (
          <option value={role.value} key={role.id}>
            {role.name}
          </option>
        ))}
      </Select>
      {(error || descriptionText) && (
        <label className="label">
          <span className={`label-text-alt ${error ? 'text-red-500' : ''}`}>
            {error || descriptionText}
          </span>
        </label>
      )}
    </div>
  );
};

export default SelectWithLabel;
