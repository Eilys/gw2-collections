interface Props {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
    disabled?: boolean;
    title?: string;
}

export default function Switch({ checked, onChange, label, disabled = false, title }: Props) {
    return (
        <label
            title={title}
            className={`flex items-center gap-2 text-sm ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                    }`}
            >
                <span
                    className={`inline-block size-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4.5" : "translate-x-0.5"
                        }`}
                />
            </button>
            {label}
        </label>
    );
}