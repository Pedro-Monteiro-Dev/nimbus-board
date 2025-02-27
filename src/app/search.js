import { useState } from "react";

export default function SearchLocation() {

    const items = [
        "Hello",
        "London",
    ];


    const filteredItems = items.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
    );

    const [query, setQuery] = useState("");

    const handleSearch = (event) => {
        setQuery(event.target.value);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search.."
                name="location_search"
                value={query}
                onChange={handleSearch}
                style={{
                padding: "10px",
                fontSize: "16px",
                }}
            />
        </div>
    

    )
}