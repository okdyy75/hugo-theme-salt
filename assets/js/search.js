//vanilla js version of https://gist.github.com/sebz/efddfc8fdcb6b480f567

var lunrIndex, $results, pagesIndex, tinySegmenter;

// Initialize lunrjs using our generated index file
function initLunr() {
    tinySegmenter = new lunr.TinySegmenter();

    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open("GET", "index.json", true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                pagesIndex = JSON.parse(request.responseText);
                console.log("index:", pagesIndex);

                // Set up lunrjs by declaring the fields we use
                // Also provide their boost level for the ranking
                lunrIndex = lunr(function () {
                    this.use(lunr.ja);
                    this.field("title", {
                        boost: 10,
                    });
                    this.field("categories");
                    this.field("tags");
                    this.field("description");

                    // ref is the result item identifier (I chose the page URL)
                    this.ref("href");
                    for (var i = 0; i < pagesIndex.length; ++i) {
                        this.add(pagesIndex[i]);
                    }
                    resolve();
                });
            } else {
                var err = textStatus + ", " + error;
                console.error("Error getting Hugo index flie:", err);
                reject(err);
            }
        };

        request.send();
    });
}

// Nothing crazy here, just hook up a event handler on the input field
function initUI() {
    $results = document.getElementById("results");
    $search = document.getElementById("search");
    $search.onkeyup = function () {
        while ($results.firstChild) {
            $results.removeChild($results.firstChild);
        }

        var query = $search.value;
        query = decodeURI(query);
        var results = search(query);
        renderResults(results);
    };
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search(query) {
    var segs = tinySegmenter.segment(query);
    segs = segs.map(function (seg) {
        seg = seg.trim();
        if (seg.length) {
            // 空でなければ、AND検索であいまい検索
            seg = `+*${seg}*`;
        }
        return seg;
    });
    query = segs.join(" ").replace(/\s+/g, " ").trim();

    // Find the item in our index corresponding to the lunr one to have more info
    // Lunr result:
    //  {ref: "/section/page1", score: 0.2725657778206127}
    // Our result:
    //  {title:"Page1", href:"/section/page1", ...}
    console.log("search:", query);
    return lunrIndex.search(query).map(function (result) {
        return pagesIndex.filter(function (page) {
            return page.href === result.ref;
        })[0];
    });
}

/**
 * Display the 10 first results
 *
 * @param  {Array} results to display
 */
function renderResults(results) {
    if (!results.length) {
        return;
    }

    // Only show the ten first results
    $results = document.getElementById("results");
    results.slice(0, 10).forEach(function (result) {
        var div = document.createElement("div");
        var category = "";
        if (result.categories) {
            category = `
                <a href="/categories/${result.categories}">
                    <i class="fas fa-folder"></i>&nbsp;${result.categories}
                </a>
            `;
        }
        var tag = "";
        if (result.tags) {
            var list = result.tags.map(function (val) {
                return `
                    <li class="partials__tagList__item">
                        <a href="/tags/${val}" class="partials__tagList__itemLink">
                            <i class="fas fa-tag partials__tagList__itemIcon"></i>${val}
                        </a>
                    </li>
                `;
            });
            tag = `
                <ul class="partials__tagList">
                    ${list.join("")}
                </ul>
            `;
        }
        div.innerHTML = `
            <article class="partials__articleCard">
                <div class="partials__articleCard__inner">
                    <a href="${result.href}" class="partials__articleCard__link"></a>
                    <img src='${result.thumbnail}' alt="${result.title}" loading="lazy" class="partials__articleCard__thumbnail">
                    <h4 class="partials__articleCard__title">
                        ${result.title}
                    </h4>
                    <div class="partials__articleCard__detail">
                        ${category}
                        <div class="partials__articleCard__detail__center"></div>
                        <div>
                            <i class="fas fa-clock"></i>&nbsp;${result.lastmod}
                        </div>
                    </div>
                    ${tag}
                    <div class="partials__articleCard__description">
                        ${result.summary}
                    </div>
                </div>
            </article>
        `;
        $results.appendChild(div);
    });
}

// Let's get started
initLunr().then(function () {
    var query = getQuery()["query"] || "";
    query = decodeURI(query);
    var results = search(query);
    renderResults(results);
    if (query.length) {
        document.getElementById("list-title").innerText = `「${query}」を検索`;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // initUI();
});

function getQuery() {
    var queryString = window.location.search;
    queryString = queryString.slice(1); // 文頭?を除外

    var queries = {};
    queryString.split("&").forEach(function (item) {
        const q = item.split("=");
        queries[q[0]] = q[1];
    });

    return queries;
}
