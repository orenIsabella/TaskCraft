async function fetchItems() {
    const response = await fetch('/api/items');
    const data = await response.json();
    console.log(data);
}

fetchItems();