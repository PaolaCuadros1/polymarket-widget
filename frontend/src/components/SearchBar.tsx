import { useState } from 'react';

interface Props {
    onSearch: (term: string) => void;
    loading: boolean;
}

export function SearchBar({ onSearch, loading }: Props) {
    const [value, setValue] = useState("");
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSearch(value.trim());
    }

    return (
        <form className="mb-4 flex gap-2" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-canvas px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-soft focus:border-accent focus:outline-none"
            />
            <button
                type="submit"
                disabled={loading}
                className="cursor-pointer rounded-lg border border-accent bg-accent-soft px-4 py-2.5 font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Searching..." : "Search"}
            </button>
        </form>
    )
}