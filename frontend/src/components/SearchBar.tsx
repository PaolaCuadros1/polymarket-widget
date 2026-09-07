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
        <form className="search-bar" onSubmit={handleSubmit}>
            <input type="text" placeholder="Search..." value={value} onChange={(e) => setValue(e.target.value)} />
            <button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
            </button>
        </form>
    )
}