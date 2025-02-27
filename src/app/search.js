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
            <input type="text" placeholder="Search.." name="location_search"></input>
            <button
                onClick={handleSearch}
                style={{
                padding: "10px 20px",
                marginLeft: "10px",
                fontSize: "16px",
                cursor: "pointer",
                }}
            >
        </div>
    

    )
}