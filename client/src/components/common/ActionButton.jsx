import React from 'react';

export default function ActionButton({
    text,
    type = 'button',
    onClick,
    icon: Icon,
    disabled = false,
    className = '',
    containerClassName = '',
}) {
    return (
        <div className={`flex justify-center ${containerClassName}`.trim()}>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`w-full md:w-80 rounded-2xl py-2.5 text-lg font-bold shadow-inner shadow-black/20 transition-colors ${
                    disabled
                        ? 'cursor-not-allowed bg-zinc-600 text-zinc-300'
                        : 'bg-[#36B083] text-zinc-900 hover:bg-green-500'
                } ${className}`.trim()}
            >
                <span className="flex items-center justify-center gap-2">
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                    <span>{text}</span>
                </span>
            </button>
        </div>
    );
}
