import React from 'react';

export default function FormInput({
    label,
    type = 'text',
    name,
    placeholder,
    value,
    onChange,
    error,
    icon: Icon,
    containerClassName = '',
    inputClassName = '',
    ...props
}) {
    return (
        <div className={containerClassName}>
            {label && <label className="text-white text-opacity-90 font-semibold mb-2 block">{label}</label>}
            <div className="relative">
                {Icon ? (
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <Icon className="h-5 w-5" />
                    </span>
                ) : null}
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full rounded-xl bg-[#303030] p-3 text-gray-300 placeholder-gray-500/50 focus:outline-none focus:ring-2 ${
                        Icon ? 'pl-11' : ''
                    } ${error ? 'ring-2 ring-red-500' : 'focus:ring-[#36B083]'} ${inputClassName}`.trim()}
                    {...props}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
