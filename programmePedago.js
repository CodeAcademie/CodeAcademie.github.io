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

            // Jour
            let d = document.createElement("div");
            let title = d.appendChild(document.createElement("h4"));
            title.innerHTML = assignDayName(dayNbr);
            document.body.appendChild(d);
            d.classList.add("flex")

            //
            let tasks = Array.from(day.getElementsByTagName("Task"));

            let half_day_tab;
            let half_a_day = 0;
            let full_day = document.createElement("div");
            d.appendChild(full_day);
            full_day.classList.add('full_day');

            tasks.forEach((task,index) => {

                if(index === 0){
                    half_day_tab = createHalfDay(!isAfternoon(tasks, index), full_day);
                }else if(isAfternoon(tasks, index) && half_a_day < 1){

                    half_a_day = 1;
                    half_day_tab = createHalfDay(!isAfternoon(tasks, index), full_day);
                }
                let li = document.createElement("li");
                li.innerHTML = task.innerHTML;

                const INDEX = CODES.findIndex(code => code.innerHTML === task.innerHTML);
                if(INDEX !== -1) {
                    const DESC = (CODES[INDEX].parentElement.getElementsByTagName("Description"));
                    const OBJECTIF = (CODES[INDEX].parentElement.getElementsByTagName("Objectif"));
                    if(OBJECTIF){
                        li.innerHTML += ' : <b>' + OBJECTIF[0].innerHTML + '</b>';
                    }
                    li.innerHTML +='<br/>';
                    if (DESC[0]) {
                        li.innerHTML += DESC[0].innerHTML;
                    }
                }
                half_day_tab.appendChild(li);
            })
            ;
        })

    })
    ;
};
createHalfDay = (isMorning, container) => {
    let half = container.appendChild(document.createElement("div"));
    half.classList.add('half_tab');
    let half_title = half.appendChild(document.createElement("h5"));
    half_title.classList.add("time_day");
    half_title.innerHTML = (isMorning ? 'Matin' : 'Après-midi');
    let ul = half.appendChild(document.createElement("ul"));
    ul.classList.add("ul")
    return ul;
};
isAfternoon = (array, index) => {
    let number = 0;
    for(let i = 0; i <= index; i++){
        number = number + +array[index].attributes[0].nodeValue;
        console.log(number)
        if(i === index){
            return number > 3.5;
        }
    }
};
makeRequest("GET", "./programme.xml", (err, xhr) => {
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


