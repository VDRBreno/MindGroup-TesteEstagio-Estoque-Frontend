import { useState } from 'react';

import { FiChevronDown } from 'react-icons/fi';

import styles from './styles.module.scss';

interface SelectProps {
  options: IOption[];
  defaultSelected?: string;
  onChange: (option: IOption) => void;
  optionsSide?: 'left' | 'right';
}

export interface IOption {
  id: string;
  value: string;
}

export default function Select({
  options,
  onChange,
  defaultSelected,
  optionsSide='left'
}: SelectProps) {
  
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultSelected ?getOption(defaultSelected) :options[0]);

  function getOption(id: string) {
    return options.filter(option => option.id===id)[0];
  }

  function toggleSelectOpenState() {
    setIsSelectOpen(state => !state);
  }

  function changeSelectedValue(option: IOption) {
    toggleSelectOpenState();
    if(option.id===selectedValue.id) return;

    setSelectedValue(option);
    onChange(option);
  }

  return (
    <div id={styles.Container}>
      <div className={styles.Selector} onClick={toggleSelectOpenState}>
        <div className={styles.Value}>
          {selectedValue.value}
        </div>
        <FiChevronDown size={20} color='#555555' />
      </div>

      {isSelectOpen ? (
        <div className={styles.Options} style={{ [optionsSide]: 0 }}>
          {options.map(option => (
            <div
              key={option.id}
              className={`${styles.Option} ${option.id===selectedValue.id ?styles.OptionSelected :''}`}
              onClick={() => changeSelectedValue(option)}
            >
              {option.value}
            </div>
          ))}
        </div>
      ) :null}
    </div>
  );
}