fetch(process.env.API_URL)
.then((response) => response.text())
.then((value) => {
    try {
        let parsed = JSON.parse(value);
        console.log(parsed);
    } catch(err){
        console.log(value);
    }
})
.catch((reason) => console.error(reason));