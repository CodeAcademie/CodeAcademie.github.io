makeRequest = (method, url, done) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
        done(null, xhr);
    };
    xhr.onerror = function () {
        done(xhr.response);
    };
    xhr.send();
};
makeRequest("GET", "programme.xml", (err, xhr) => {
    const MODULES = Array.from(xhr.responseXML.documentElement.getElementsByTagName("Code"));
    console.log(MODULES)
/*
    MODULES.forEach((module) => {
        const SEQUENCE = Array.from(module.getElementsByTagName("Sequence"));

        SEQUENCE.forEach((sequence) => {
            const ACTIVITY = Array.from(sequence.getElementsByTagName("Activite"));

            ACTIVITY.forEach((activity) => {
                const DESCRIPTION = Array.from(activity.getElementsByTagName("Description"));

                const CODE = activity.getElementsByTagName("Code");

                DESCRIPTION.forEach((description) => {
                    if(description.innerHTML.includes("https://github.com/CodeAcademie/")){
                        xmlRequest(CODE[0].innerHTML).then((response) => {
                            console.log(response)
                        });
                    }
                });

            });
        })
    })*/
});

xmlRequest = (code) => {
    return new Promise(function (resolve, reject) {
        const Readme = new XMLHttpRequest();
        if (code) {
            Readme.open('GET', 'https://raw.githubusercontent.com/CodeAcademie/' + code+ '/master/README.md');
            Readme.onreadystatechange = () =>
            {
                if (Readme.status !== 404) {
                    console.log(Readme.responseText);
                    resolve(Readme.responseText);
                }
            };
            Readme.send();
        }
    })
};
