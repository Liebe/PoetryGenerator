var APP = APP || {};

APP.Run = function() {
    APP.GeneratePoem();
}

/// Get full poem
APP.GetFullPoem = function() {
    APP.GetPoems()
    .then(result => {
        if (result) {
            let poems = result.values;
            let poem = poems[Math.floor(Math.random() * poems.length)];
            APP.AddFragments(poem);
        }
    })
}

/// Gererates a new poem based of fragments of all poems.
APP.GeneratePoem = function () {
    APP.GetPoems()
    .then(result => { 
        if (result) {
            let poems = result.values;
            let selectedPoems = [];
            let selectedFragments = [];

            // Shuffle and select first 2-4 poems (TODO: make these numbers into user inputs)
            poems.sort(function() { return 0.5 - Math.random() });
            selectedPoems = poems.slice(0, Math.floor(Math.random() * 3) + 2);

            // For each selecte poem, select fragment
            selectedPoems.forEach((poem, i) => {
                let fragment;

                // If first, select first fragment
                if (i === 0) {
                    fragment = poem[0];
                } // If last, select last fragment
                else if (i === selectedPoems.length - 1) {
                    fragment = poem[poem.length - 1];
                }
                else { // Else, randomize
                    fragment = poem[Math.floor(Math.random() * poem.length)];
                }

                selectedFragments.push(fragment);
            });

            APP.AddFragments(selectedFragments);
        }
    });
}

/// Adds fragments of poem(s) to html node
APP.AddFragments = function(fragments) {
    let poemNode = document.getElementById("poem");
    poemNode.textContent = "";

    // Add fragments to node
    fragments.forEach((fragment, i) => {
        
        // Format fragment
        if (i === 0) {
            fragment = fragment.charAt(0).toUpperCase() + fragment.slice(1);
            fragment = '"' + fragment;
        }
        if (i === fragments.length - 1) {
            fragment = fragment + '"';
        }

        // Add to node
        let framgentNode = document.createElement("span");
        framgentNode.textContent = fragment;
        poemNode.appendChild(framgentNode);
    });
}

/// Gets poems from Google Spreadsheet.
APP.GetPoems = function() {
    return fetch('https://sheets.googleapis.com/v4/spreadsheets/1QbTVndIZn95DymZKldJjtOGkEJn3ab6KQdkUSX1GWZY/values/A1:D100?key=AIzaSyAROUHOYJS_06C6J6b2rjoxJszMTXgeRho')
    .then(data => { 
        if(data.ok) {
            return data.json();
        }
    })
}

window.onload = APP.Run;