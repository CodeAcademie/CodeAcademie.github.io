makeRequest = (method, url, done) => {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
        done(null, xhr);
    };
    xhr.onerror = function () {
        done(xhr.response);
    };
    xhr.send();
};
assignDayName = (dayNbr) => {

    switch (dayNbr) {
        case 1:
            return 'Lundi';
            break
        case 2:
            return 'Mardi';
            break
        case 3:
            return 'Mercredi';
            break
        case 4:
            return 'Jeudi';
            break
        case 5:
            return 'Vendredi';
            break
    }
};
generateHTML = (xhr, CODES) => {
    let weeks = Array.from(xhr.responseXML.documentElement.getElementsByTagName("Semaine"));

    let i = 0;
    weeks.forEach((week) => {
        let weekNbr = week.attributes[0].nodeValue - 20;
        let s = document.createElement("h1");
        s.id = weekNbr;
        s.innerHTML = "Semaine " + weekNbr;
        document.body.appendChild(s);
        let days = Array.from(week.getElementsByTagName("Jour"));

        days.forEach(async (day) => {
            let dayNbr = day.attributes[0].nodeValue - 0;

            let d = document.createElement("h2");
            d.innerHTML = assignDayName(dayNbr);
            document.body.appendChild(d);

            let tasks = Array.from(day.getElementsByTagName("Task"));
            let ul = document.createElement("ul");
            let list = document.body.appendChild(ul);
            let y = 0;
            tasks.forEach((task) => {
                let li = document.createElement("li");
                li.innerHTML = task.innerHTML + '<br/>';
                const INDEX = CODES.findIndex(code => code.innerHTML === task.innerHTML);
                if(INDEX !== -1) {
                    const DESC = (CODES[INDEX].parentElement.getElementsByTagName("Description"));
                    const OBJECTIF = (CODES[INDEX].parentElement.getElementsByTagName("Objectif"));
                    if (DESC[0]) {
                        li.innerHTML += DESC[0].innerHTML;
                    } else if(OBJECTIF){
                        li.innerHTML += OBJECTIF[0].innerHTML;
                    }
                }
                ul.appendChild(li);
            })
            ;
        })

    })
    ;
};
makeRequest("GET", "programme.xml", (err, xhr) => {
    const CODES = Array.from(xhr.responseXML.documentElement.getElementsByTagName("Code"));
    makeRequest("GET", "./Tronc/prairie.xml", (err, xhr) => {
        generateHTML(xhr, CODES);
    });
    makeRequest("GET", "./Tronc/01.xml", (err, xhr) => {
        generateHTML(xhr, CODES);
    });
    makeRequest("GET", "./Tronc/02.xml", (err, xhr) => {
        generateHTML(xhr, CODES);
    });
    makeRequest("GET", "./Tronc/03.xml", (err, xhr) => {
        generateHTML(xhr, CODES);
    });
    makeRequest("GET", "./Tronc/04.xml", (err, xhr) => {
        generateHTML(xhr, CODES);
    });

    makeRequest("GET", "./Fork/back.xml", (err, xhr) => {
        let h2 = document.createElement("h2");
        h2.innerHTML = "Parcours Back-end";
        document.body.appendChild(h2);
        generateHTML(xhr, CODES);
    });

    makeRequest("GET", "./Fork/front.xml", (err, xhr) => {
        let h2 = document.createElement("h2");
        h2.innerHTML = "Parcours Front-end/Integration";
        document.body.appendChild(h2);
        generateHTML(xhr, CODES);
    });

    makeRequest("GET", "./Fork/mobile.xml", (err, xhr) => {
        let h2 = document.createElement("h2");
        h2.innerHTML = "Parcours Mobile";
        document.body.appendChild(h2);
        generateHTML(xhr, CODES);
    });

    makeRequest("GET", "./Fork/wp.xml", (err, xhr) => {
        let h2 = document.createElement("h2");
        h2.innerHTML = "Parcours WordPress";
        document.body.appendChild(h2);
        generateHTML(xhr, CODES);
    });
    setTimeout(
        () => test(), 20000
    )
});

function test() {
    var turndownService = new TurndownService()
    var markdown = turndownService.turndown(document.body);
    console.log(markdown)
}

xmlRequest = (code) => {
    return new Promise(function (resolve, reject) {
        const Readme = new XMLHttpRequest();
        if (code) {
            Readme.open('GET', 'https://raw.githubusercontent.com/CodeAcademie/' + code + '/master/README.md');
            Readme.onreadystatechange = () => {
                if (Readme.status !== 404) {
                    console.log(Readme.responseText);
                    resolve(Readme.responseText);
                }
            };
            Readme.send();
        }
    })
};


