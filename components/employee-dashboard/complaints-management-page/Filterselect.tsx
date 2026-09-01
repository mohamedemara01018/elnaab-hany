type FilterSelectProps = {
    label: string;
    options: string[];
};

export function FilterSelect({ label, options }: FilterSelectProps) {
    return (
        <select
            defaultValue={label}
            className="input-field w-full py-2.5 px-3 text-body-small text-on-surface-variant appearance-none cursor-pointer"
        >
            <option value={label}>{label}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    );
}