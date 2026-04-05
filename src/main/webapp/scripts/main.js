async function safeFetch(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error("Fetch failed:", error);
        return {status: 500, data: null, error: error.message};
    }
}

function loadMemes() {
    safeFetch('api/memes').then((response) => {
        const container = document.getElementById('meme-container');
        if (!container) return;
        if (response.status === 200) {
            container.innerHTML = response.data.map(({type, path}) => `
                <div class="meme-card">
                    <h3>${type}</h3>
                    <img src="${path}" alt="">
                </div>
            `).join('');
        } else {
            container.innerHTML = "There's no memes";
        }
    });
}

loadMemes();
