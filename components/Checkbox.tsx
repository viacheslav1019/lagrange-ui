import React from 'react'
import { CheckIcon } from '@heroicons/react/solid'

const Checkbox = ({ checked, children, disabled = false, ...props }) => (
  <label className="default-transition flex cursor-pointer items-center text-th-fgd-3 hover:text-th-fgd-2">
    <input
      checked={checked}
      {...props}
      disabled={disabled}
      type="checkbox"
      style={{
        border: '0',
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: '0',
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: '1px',
      }}
    />
    <div
      className={`${
        checked && !disabled ? 'border-th-primary' : 'border-th-fgd-4'
      } checkbox-border h-4 w-4 default-transition flex items-center justify-center`}
    >
      <CheckIcon
        className={`${checked ? 'block' : 'hidden'} h-4 w-4 ${
          disabled ? 'text-th-fgd-4' : 'text-th-primary'
        }`}
      />
    </div>
    <span
      className={`check-text ml-2 ${checked && !disabled ? 'check-text' : ''}`}
    >
      {children}
    </span>
  </label>
)

export default Checkbox
